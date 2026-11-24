import bpy
import bmesh
import math
import os
import numpy as np

OUT_DIR = r"c:\Users\HP\Desktop\WEB SİTESİ\qiens-home\public\models"
SCRATCH_DIR = r"C:\Users\HP\.gemini\antigravity\brain\becd638e-a139-404a-8948-0376ee28b3fb\scratch"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(SCRATCH_DIR, exist_ok=True)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_boucle_textures():
    """Generate high-definition warm oatmeal-beige 3D knotted boucle fabric color + normal/bump texture."""
    w, h = 512, 512
    rng = np.random.default_rng(2026)

    # Multi-scale boucle loop texture (coarse slub knots + fine yarn weave)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    loop_u = np.sin(x * (128.0 * math.pi / w)) * np.cos(y * (128.0 * math.pi / h))
    loop_v = np.sin((x + y) * (96.0 * math.pi / w))
    fine_noise = rng.normal(0.0, 0.055, (h, w)).astype(np.float32)
    knot_mask = (rng.random((h // 2, w // 2)) > 0.68).astype(np.float32)
    knot_upscaled = np.repeat(np.repeat(knot_mask, 2, axis=0), 2, axis=1)

    height_map = np.clip(0.5 + 0.16 * loop_u + 0.10 * loop_v + fine_noise + 0.14 * knot_upscaled, 0.0, 1.0)

    # Warm oatmeal-taupe catalog color palette with rich speckled dark/light boucle knots
    base_color = np.array([[[0.77, 0.68, 0.58]]], dtype=np.float32)
    dark_fleck = np.array([[[0.52, 0.43, 0.35]]], dtype=np.float32)
    light_knot = np.array([[[0.89, 0.83, 0.75]]], dtype=np.float32)

    h3 = height_map[:, :, None]
    rgb = base_color * (0.72 + 0.35 * h3)
    rgb = np.where(knot_upscaled[:, :, None] > 0.5, light_knot * 0.95, rgb)
    fleck_mask = (rng.random((h, w)) > 0.84)[:, :, None]
    rgb = np.where(fleck_mask, dark_fleck, rgb)
    rgb = np.clip(rgb, 0.35, 0.94)

    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, :3] = rgb

    col_img = bpy.data.images.new("LimoonBoucleColor", width=w, height=h)
    col_img.pixels.foreach_set(rgba.ravel())
    col_img.pack()

    # Compute tangent-space normal map from height_map so WebGL / ARCore renders real 3D fabric relief!
    dx = np.roll(height_map, -1, axis=1) - np.roll(height_map, 1, axis=1)
    dy = np.roll(height_map, -1, axis=0) - np.roll(height_map, 1, axis=0)
    strength = 3.2
    nx = -dx * strength
    ny = -dy * strength
    nz = np.ones_like(height_map)
    norm = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx /= norm
    ny /= norm
    nz /= norm

    n_rgba = np.ones((h, w, 4), dtype=np.float32)
    n_rgba[:, :, 0] = nx * 0.5 + 0.5
    n_rgba[:, :, 1] = ny * 0.5 + 0.5
    n_rgba[:, :, 2] = nz * 0.5 + 0.5

    norm_img = bpy.data.images.new("LimoonBoucleNormal", width=w, height=h)
    norm_img.colorspace_settings.name = 'Non-Color'
    norm_img.pixels.foreach_set(n_rgba.ravel())
    norm_img.pack()

    return col_img, norm_img


def make_geo_pillow_texture():
    """Generate the exact Limoon geometric woven kilim/diamond throw pillow pattern from the photo."""
    w, h = 512, 512
    rgba = np.ones((h, w, 4), dtype=np.float32)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)

    # Normalised UV coordinates with 3x3 diamond mosaic tiles + subtle fabric weave grain
    u = (x / (w / 3.0)) % 1.0
    v = (y / (h / 3.0)) % 1.0
    du = u - 0.5
    dv = v - 0.5
    manhattan = np.abs(du) + np.abs(dv)

    cream = np.array([0.91, 0.86, 0.78], dtype=np.float32)
    sand = np.array([0.76, 0.66, 0.56], dtype=np.float32)
    taupe = np.array([0.56, 0.45, 0.36], dtype=np.float32)
    espresso = np.array([0.25, 0.18, 0.14], dtype=np.float32)

    # Rich triangle / chevron / diamond patchwork matching Limoon's throw pillows
    rgb = np.where(
        manhattan[:, :, None] < 0.22,
        cream,
        np.where(
            manhattan[:, :, None] < 0.34,
            espresso,
            np.where(
                (du * dv)[:, :, None] > 0.0,
                taupe,
                sand,
            ),
        ),
    )

    #Crisp diagonal geometric border lines
    diag1 = np.abs(np.abs(du) - np.abs(dv)) < 0.032
    rgb = np.where(diag1[:, :, None], espresso, rgb)

    # Subtle woven linen grain
    weave = (np.sin(x * 0.45) * np.cos(y * 0.45) * 0.025)[:, :, None]
    rgb = np.clip(rgb + weave, 0.12, 0.96)
    rgba[:, :, :3] = rgb

    img = bpy.data.images.new("LimoonPillowGeoTex", width=w, height=h)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


def create_materials():
    mats = {}

    # 1. Oatmeal 3D Boucle Fabric with Normal Map
    m_fab = bpy.data.materials.new("LimoonBoucle")
    m_fab.use_nodes = True
    nodes = m_fab.node_tree.nodes
    links = m_fab.node_tree.links
    bsdf = nodes.get("Principled BSDF")

    col_img, norm_img = make_boucle_textures()
    tex_node = nodes.new("ShaderNodeTexImage")
    tex_node.image = col_img
    links.new(bsdf.inputs["Base Color"], tex_node.outputs["Color"])

    norm_tex = nodes.new("ShaderNodeTexImage")
    norm_tex.image = norm_img
    norm_map = nodes.new("ShaderNodeNormalMap")
    norm_map.inputs["Strength"].default_value = 0.85
    links.new(norm_map.inputs["Color"], norm_tex.outputs["Color"])
    links.new(bsdf.inputs["Normal"], norm_map.outputs["Normal"])

    bsdf.inputs["Roughness"].default_value = 0.88
    if "Sheen Weight" in bsdf.inputs:
        bsdf.inputs["Sheen Weight"].default_value = 0.25
    mats["fabric"] = m_fab

    # 2. Dark Walnut Plinth Base (Baza Şeridi - clearly visible above the wooden legs)
    m_plinth = bpy.data.materials.new("LimoonWalnutPlinth")
    m_plinth.use_nodes = True
    bsdf = m_plinth.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.23, 0.15, 0.11, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.52
    mats["plinth"] = m_plinth

    # 3. Warm Cherry/Walnut Wood (Chunky Flush Legs & Signature Oval Armrest Capsule)
    m_wood = bpy.data.materials.new("LimoonWarmWood")
    m_wood.use_nodes = True
    bsdf = m_wood.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.50, 0.24, 0.09, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.30
    mats["wood"] = m_wood

    # 4. Geometric Square Throw Pillow
    m_pil = bpy.data.materials.new("LimoonGeoPillow")
    m_pil.use_nodes = True
    bsdf = m_pil.node_tree.nodes.get("Principled BSDF")
    ptex = m_pil.node_tree.nodes.new("ShaderNodeTexImage")
    ptex.image = make_geo_pillow_texture()
    m_pil.node_tree.links.new(bsdf.inputs["Base Color"], ptex.outputs["Color"])
    bsdf.inputs["Roughness"].default_value = 0.82
    mats["pillow"] = m_pil

    # 5. Smoked Tempered Glass (Coffee Table Top)
    m_glass = bpy.data.materials.new("LimoonSmokedGlass")
    m_glass.use_nodes = True
    bsdf = m_glass.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.14, 0.15, 0.16, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.18
    bsdf.inputs["Roughness"].default_value = 0.06
    bsdf.inputs["Alpha"].default_value = 0.72
    m_glass.blend_method = 'BLEND'
    mats["glass"] = m_glass

    return mats


def add_bevel_box(name, size_xyz, loc_xyz, mat, bevel_width=0.04, segments=4, rot_xyz=(0, 0, 0), uv_scale=0.45):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc_xyz, rotation=rot_xyz)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size_xyz
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bev = obj.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = bevel_width
    bev.segments = segments
    bev.limit_method = 'NONE'
    bpy.ops.object.modifier_apply(modifier="Bevel")

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cube_project(cube_size=uv_scale)
    bpy.ops.object.mode_set(mode='OBJECT')

    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.append(mat)
    return obj


def add_plump_square_pillow(name, width=0.42, height=0.42, thickness=0.14, loc_xyz=(0, 0, 0), rot_xyz=(0, 0, 0), mat=None):
    """Build a realistic square fabric throw cushion with pinched square corners and plump center (never octagonal!)."""
    mesh = bpy.data.meshes.new(name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    nx, nz = 14, 14
    uv_layer = bm.loops.layers.uv.new("UVMap")

    # Create front and back grids + stitched seam border
    front_verts = [[None] * (nx + 1) for _ in range(nz + 1)]
    back_verts = [[None] * (nx + 1) for _ in range(nz + 1)]

    for iz in range(nz + 1):
        v_norm = iz / nz  # 0..1
        z_local = (v_norm - 0.5) * height
        pz = math.sin(v_norm * math.pi)
        for ix in range(nx + 1):
            u_norm = ix / nx  # 0..1
            x_local = (u_norm - 0.5) * width
            px = math.sin(u_norm * math.pi)

            # Soft pillow puff profile: plump in center, pinched seam at edges & corners
            puff = (px * pz) ** 0.72
            # Subtle corner flare so square pillow corners look natural
            corner_pinch = 1.0 - 0.06 * math.sin(u_norm * math.pi) * math.sin(v_norm * math.pi)
            x_pos = x_local * corner_pinch
            z_pos = z_local * corner_pinch
            y_half = 0.008 + (thickness * 0.5) * puff

            vf = bm.verts.new((x_pos, -y_half, z_pos))
            front_verts[iz][ix] = vf
            if 0 < iz < nz and 0 < ix < nx:
                vb = bm.verts.new((x_pos, y_half, z_pos))
                back_verts[iz][ix] = vb
            else:
                # Share seam boundary vertices so the pillow edge is a continuous stitched seam
                back_verts[iz][ix] = vf

    bm.verts.ensure_lookup_table()

    # Front faces (-Y normal facing viewer)
    for iz in range(nz):
        for ix in range(nx):
            v1 = front_verts[iz][ix]
            v2 = front_verts[iz][ix + 1]
            v3 = front_verts[iz + 1][ix + 1]
            v4 = front_verts[iz + 1][ix]
            try:
                f = bm.faces.new((v1, v2, v3, v4))
                for loop, (uu, vv) in zip(
                    f.loops,
                    [
                        (ix / nx, iz / nz),
                        ((ix + 1) / nx, iz / nz),
                        ((ix + 1) / nx, (iz + 1) / nz),
                        (ix / nx, (iz + 1) / nz),
                    ],
                ):
                    loop[uv_layer].uv = (uu, vv)
            except ValueError:
                pass

    # Back faces (+Y normal)
    for iz in range(nz):
        for ix in range(nx):
            v1 = back_verts[iz][ix]
            v2 = back_verts[iz + 1][ix]
            v3 = back_verts[iz + 1][ix + 1]
            v4 = back_verts[iz][ix + 1]
            try:
                f = bm.faces.new((v1, v2, v3, v4))
                for loop, (uu, vv) in zip(
                    f.loops,
                    [
                        (ix / nx, iz / nz),
                        (ix / nx, (iz + 1) / nz),
                        ((ix + 1) / nx, (iz + 1) / nz),
                        ((ix + 1) / nx, iz / nz),
                    ],
                ):
                    loop[uv_layer].uv = (uu, vv)
            except ValueError:
                pass

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    for poly in mesh.polygons:
        poly.use_smooth = True
    if mat:
        mesh.materials.append(mat)

    obj.location = loc_xyz
    obj.rotation_euler = rot_xyz
    return obj


def build_limoon_sofa(mats, total_width=2.25, prefix="Sofa3", offset_x=0.0, offset_z=0.0, rot_y=0.0):
    """Build the exact Limoon sofa matching limoon-3lu-koltuk.jpg & limoon-koltuk-takimi.jpg:
    - Low, chunky warm-wood block legs flush near the front & side corners (leg_h = 0.08m, z = 0.00..0.08m)
    - Prominent dark-walnut rounded plinth strip (baza şeridi) extending flush under the seat cushions
    - Deep plush monoblock-style double seat cushions with rich boucle texture
    - Sweeping sloped side walls + pillow-top armrests with signature oval warm-wood front inserts
    - Plush back cushions with center button tuft dimple + realistic square geometric throw pillows
    """
    parent = bpy.data.objects.new(f"{prefix}_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)
    parent.rotation_euler = (0.0, 0.0, rot_y)

    parts = []
    depth = 0.98
    # Low-profile 7.8 cm chunky wooden legs sitting strictly at z = 0.000m (exact floor contact!)
    leg_h = 0.078

    # 1. Five Chunky Wooden Block Legs (positioned flush near the front and outer edges like the real photo!)
    leg_positions = [
        (-total_width * 0.435, -depth * 0.41, 0.082, 0.12),
        (0.0, -depth * 0.40, 0.068, 0.11),
        (total_width * 0.435, -depth * 0.41, 0.082, 0.12),
        (-total_width * 0.435, depth * 0.40, 0.082, 0.12),
        (total_width * 0.435, depth * 0.40, 0.082, 0.12),
    ]
    for idx, (lx, ly, lw, ld) in enumerate(leg_positions):
        leg = add_bevel_box(
            f"{prefix}_Leg_{idx}",
            (lw, ld, leg_h),
            (lx, ly, leg_h / 2.0),
            mats["wood"],
            bevel_width=0.006,
            segments=2,
        )
        parts.append(leg)

    # 2. Prominent Dark Walnut Plinth Base (Baza Şeridi - extends right out to the front & sides so it's clearly visible!)
    plinth_h = 0.052
    plinth = add_bevel_box(
        f"{prefix}_Plinth",
        (total_width * 0.992, depth * 0.965, plinth_h),
        (0.0, -0.005, leg_h + plinth_h / 2.0),
        mats["plinth"],
        bevel_width=0.022,
        segments=3,
    )
    parts.append(plinth)

    # 3. Two Deep Plush Seat Cushions sitting tightly on top of the walnut plinth
    seat_h = 0.255
    seat_z = leg_h + plinth_h + seat_h / 2.0 - 0.004
    half_w = (total_width * 0.995) / 2.0
    for s_idx, sx in enumerate([-half_w / 2.0, half_w / 2.0]):
        seat = add_bevel_box(
            f"{prefix}_Seat_{s_idx}",
            (half_w - 0.006, depth * 0.96, seat_h),
            (sx, -0.012, seat_z),
            mats["fabric"],
            bevel_width=0.068,
            segments=5,
            uv_scale=0.35,
        )
        parts.append(seat)

    # 4. Outer Back Frame & Sweeping Side Wings
    back_z = leg_h + plinth_h + seat_h + 0.16
    back_frame = add_bevel_box(
        f"{prefix}_BackFrame",
        (total_width * 0.95, 0.18, 0.38),
        (0.0, depth * 0.39, back_z),
        mats["fabric"],
        bevel_width=0.055,
        segments=4,
        uv_scale=0.35,
    )
    parts.append(back_frame)

    # 5. Two Wide Rounded Back Cushions with Center Tuft Dimple
    inner_w = total_width - 0.48
    bc_w = inner_w / 2.0
    for b_idx, bx in enumerate([-bc_w / 2.0, bc_w / 2.0]):
        bc = add_bevel_box(
            f"{prefix}_BackCushion_{b_idx}",
            (bc_w - 0.012, 0.21, 0.43),
            (bx, depth * 0.23, leg_h + plinth_h + seat_h + 0.185),
            mats["fabric"],
            bevel_width=0.082,
            segments=5,
            rot_xyz=(math.radians(7), 0, 0),
            uv_scale=0.35,
        )
        parts.append(bc)
        tuft = add_bevel_box(
            f"{prefix}_Tuft_{b_idx}",
            (0.026, 0.018, 0.026),
            (bx, depth * 0.122, leg_h + plinth_h + seat_h + 0.20),
            mats["plinth"],
            bevel_width=0.008,
            segments=2,
        )
        parts.append(tuft)

    # 6. Sweeping Side Wings + Pillow-Top Armrests + Oval Warm-Wood Front Insert + Plump Square Throw Pillows
    arm_w = 0.24
    for side_idx, sign in enumerate([-1.0, 1.0]):
        ax = sign * (total_width / 2.0 - arm_w / 2.0 - 0.008)

        # Sweeping sloped side wall connecting backrest to armrest (as seen in left sofa of limoon-koltuk-takimi.jpg)
        side_wing = add_bevel_box(
            f"{prefix}_SideWing_{side_idx}",
            (arm_w * 0.88, depth * 0.48, 0.26),
            (ax, depth * 0.18, leg_h + plinth_h + seat_h + 0.15),
            mats["fabric"],
            bevel_width=0.055,
            segments=4,
            rot_xyz=(math.radians(-18), 0, 0),
            uv_scale=0.35,
        )
        parts.append(side_wing)

        # Lower armrest base
        arm_base = add_bevel_box(
            f"{prefix}_ArmBase_{side_idx}",
            (arm_w, depth * 0.86, 0.17),
            (ax, 0.01, leg_h + plinth_h + seat_h + 0.065),
            mats["fabric"],
            bevel_width=0.055,
            segments=4,
            uv_scale=0.35,
        )
        parts.append(arm_base)

        # Top rolled armrest pillow bolster
        arm_pillow = add_bevel_box(
            f"{prefix}_ArmTopPillow_{side_idx}",
            (arm_w * 1.03, depth * 0.82, 0.095),
            (ax, 0.0, leg_h + plinth_h + seat_h + 0.145),
            mats["fabric"],
            bevel_width=0.042,
            segments=4,
            uv_scale=0.35,
        )
        parts.append(arm_pillow)

        # Signature Oval Warm-Wood Insert embedded inside the front face of each armrest!
        wood_insert = add_bevel_box(
            f"{prefix}_ArmWoodInsert_{side_idx}",
            (arm_w * 0.58, 0.055, 0.056),
            (ax, -depth * 0.395, leg_h + plinth_h + seat_h + 0.095),
            mats["wood"],
            bevel_width=0.025,
            segments=4,
        )
        parts.append(wood_insert)

        # True Plump Square Geometric Throw Pillow (42x42 cm) leaning against the armrest
        px = sign * (total_width / 2.0 - arm_w - 0.14)
        pillow = add_plump_square_pillow(
            f"{prefix}_ThrowPillow_{side_idx}",
            width=0.41,
            height=0.41,
            thickness=0.14,
            loc_xyz=(px, depth * 0.05, leg_h + plinth_h + seat_h + 0.175),
            rot_xyz=(math.radians(14), math.radians(-sign * 14), math.radians(sign * 12)),
            mat=mats["pillow"],
        )
        parts.append(pillow)

    for p in parts:
        p.parent = parent
    return parent


def build_limoon_berjer(mats, offset_x=0.0, offset_z=0.0, rot_y=0.0):
    """Build the exact Limoon Tekli Berjer from limoon-berjer.jpg:
    - Exposed warm walnut front & rear corner legs starting strictly at z = 0.000m and rising up the lower sides
    - Deep rounded seat cushion + curved wrap-around tub backrest & sloped armrests
    """
    parent = bpy.data.objects.new("Berjer_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)
    parent.rotation_euler = (0.0, 0.0, rot_y)

    parts = []
    w, d = 0.84, 0.86

    # 4 Exposed Walnut Corner Legs starting strictly at z = 0.000m
    for idx, (lx, ly, lh) in enumerate([
        (-w * 0.39, -d * 0.38, 0.25),
        (w * 0.39, -d * 0.38, 0.25),
        (-w * 0.39, d * 0.38, 0.23),
        (w * 0.39, d * 0.38, 0.23),
    ]):
        leg = add_bevel_box(
            f"Berjer_Leg_{idx}",
            (0.055, 0.065, lh),
            (lx, ly, lh / 2.0),
            mats["wood"],
            bevel_width=0.008,
            segments=2,
        )
        parts.append(leg)

    # Lower upholstered apron (clearance above floor = 8.5 cm matching real berjer photo)
    apron = add_bevel_box(
        "Berjer_Apron",
        (w * 0.88, d * 0.88, 0.13),
        (0, 0, 0.15),
        mats["fabric"],
        bevel_width=0.032,
        segments=4,
        uv_scale=0.35,
    )
    parts.append(apron)

    # Thick Plush Seat Cushion
    seat = add_bevel_box(
        "Berjer_Seat",
        (w * 0.84, d * 0.86, 0.24),
        (0, -0.02, 0.30),
        mats["fabric"],
        bevel_width=0.068,
        segments=5,
        uv_scale=0.35,
    )
    parts.append(seat)

    # Curved Backrest
    back = add_bevel_box(
        "Berjer_Back",
        (w * 0.92, 0.21, 0.48),
        (0, d * 0.32, 0.55),
        mats["fabric"],
        bevel_width=0.078,
        segments=5,
        rot_xyz=(math.radians(6), 0, 0),
        uv_scale=0.35,
    )
    parts.append(back)

    # Wrap-around Sloped Side Armrests
    for idx, sign in enumerate([-1.0, 1.0]):
        arm = add_bevel_box(
            f"Berjer_Arm_{idx}",
            (0.16, d * 0.84, 0.38),
            (sign * (w * 0.39), 0.02, 0.45),
            mats["fabric"],
            bevel_width=0.058,
            segments=5,
            rot_xyz=(math.radians(-6), 0, 0),
            uv_scale=0.35,
        )
        parts.append(arm)

    for p in parts:
        p.parent = parent
    return parent


def build_limoon_coffee_table(mats, offset_x=0.0, offset_z=0.0):
    """Build the exact Limoon Smoked-Glass & Walnut Coffee Table."""
    parent = bpy.data.objects.new("CoffeeTable_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)

    parts = []
    w, d, h = 1.25, 0.70, 0.44

    # 4 Walnut Vertical Legs starting strictly at z = 0.000m
    for idx, (lx, ly) in enumerate([
        (-w * 0.36, -d * 0.36),
        (w * 0.36, -d * 0.36),
        (-w * 0.36, d * 0.36),
        (w * 0.36, d * 0.36),
    ]):
        leg = add_bevel_box(
            f"CT_Leg_{idx}",
            (0.048, 0.048, h - 0.018),
            (lx, ly, (h - 0.018) / 2.0),
            mats["wood"],
            bevel_width=0.006,
            segments=2,
        )
        parts.append(leg)

    # Lower Slatted Wooden Shelf
    shelf_z = 0.13
    for s_idx in range(5):
        sy = -d * 0.28 + s_idx * (d * 0.14)
        slat = add_bevel_box(
            f"CT_Slat_{s_idx}",
            (w * 0.74, 0.058, 0.022),
            (0, sy, shelf_z),
            mats["wood"],
            bevel_width=0.005,
            segments=2,
        )
        parts.append(slat)

    # Upper Wooden Crossbars
    for idx, sy in enumerate([-d * 0.36, d * 0.36]):
        bar = add_bevel_box(
            f"CT_Bar_{idx}",
            (w * 0.76, 0.04, 0.035),
            (0, sy, h - 0.035),
            mats["wood"],
            bevel_width=0.006,
            segments=2,
        )
        parts.append(bar)

    # Smoked Tempered Glass Top
    glass = add_bevel_box(
        "CT_GlassTop",
        (w, d, 0.018),
        (0, 0, h - 0.009),
        mats["glass"],
        bevel_width=0.006,
        segments=2,
    )
    parts.append(glass)

    for p in parts:
        p.parent = parent
    return parent


def snap_scene_strictly_to_ground():
    """Ensure the lowest vertex in the entire exported scene sits at exactly Z = 0.0000m (zero floating in AR!)."""
    bpy.context.view_layer.update()
    min_z = None
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    for obj in mesh_objs:
        mw = obj.matrix_world
        for v in obj.data.vertices:
            wz = (mw @ v.co).z
            if min_z is None or wz < min_z:
                min_z = wz
    if min_z is not None and abs(min_z) > 1e-5:
        for obj in bpy.context.scene.objects:
            if obj.parent is None:
                obj.location.z -= min_z
        bpy.context.view_layer.update()


def export_glb(filename):
    snap_scene_strictly_to_ground()
    path = os.path.join(OUT_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        export_apply=True,
        export_materials='EXPORT',
    )
    print("EXPORTED_GLB:", path, os.path.getsize(path))


# 1. Export Individual 1. İkili / Ana Bukle Koltuk (225 cm)
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=2.25, prefix="Limoon3Lu")
export_glb("limoon-3lu-koltuk.glb")
export_glb("GlamVelvetSofa.glb")

# 2. Export Individual 2. İkili Yan Bukle Koltuk (195 cm)
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=1.95, prefix="Limoon2Li")
export_glb("limoon-2li-koltuk.glb")

# 3. Export Individual Tekli Berjer (84 cm)
clear_scene()
mats = create_materials()
build_limoon_berjer(mats)
export_glb("limoon-berjer.glb")

# 4. Export Individual Orta Sehpa (125 cm)
clear_scene()
mats = create_materials()
build_limoon_coffee_table(mats)
export_glb("limoon-orta-sehpa.glb")
export_glb("orta-sehpa.glb")

# 5. Export Full Living Room Set
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=2.25, prefix="MainSofa3", offset_x=0.0, offset_z=1.35, rot_y=0.0)
build_limoon_sofa(mats, total_width=1.95, prefix="SideSofa2", offset_x=-1.75, offset_z=-0.05, rot_y=math.radians(-90))
build_limoon_berjer(mats, offset_x=1.65, offset_z=-0.10, rot_y=math.radians(65))
build_limoon_coffee_table(mats, offset_x=0.0, offset_z=0.10)
export_glb("limoon-koltuk-tam-takim.glb")
export_glb("oturma-grubu-tam-takim.glb")

# Render verification preview image
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
scene.render.resolution_x = 1200
scene.render.resolution_y = 800

bpy.ops.object.camera_add(location=(0.2, -3.9, 1.55), rotation=(math.radians(74), 0, math.radians(3)))
cam = bpy.context.active_object
scene.camera = cam

bpy.ops.object.light_add(type='AREA', location=(2.0, -2.5, 3.8))
l1 = bpy.context.active_object
l1.data.energy = 1200
l1.data.size = 4.0

bpy.ops.object.light_add(type='AREA', location=(-2.5, -1.5, 2.8))
l2 = bpy.context.active_object
l2.data.energy = 600
l2.data.size = 3.0

preview_path = os.path.join(SCRATCH_DIR, "limoon_3d_set_preview_v2.png")
scene.render.filepath = preview_path
bpy.ops.render.render(write_still=True)
print("PREVIEW_RENDERED:", preview_path)
