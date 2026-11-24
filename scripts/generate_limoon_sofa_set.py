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


def make_boucle_texture():
    """Generate a warm oatmeal-beige speckled boucle fabric texture matching the uploaded photos."""
    w, h = 256, 256
    rng = np.random.default_rng(101)
    # Warm oatmeal base RGB ~(0.76, 0.67, 0.58)
    noise = rng.normal(0.0, 0.045, (h, w, 1)).astype(np.float32)
    weave_x = (np.sin(np.linspace(0, 64 * math.pi, w)) * 0.018)[None, :, None]
    weave_y = (np.sin(np.linspace(0, 64 * math.pi, h)) * 0.018)[:, None, None]
    base = np.array([[[0.76, 0.66, 0.56]]], dtype=np.float32)
    rgb = np.clip(base + noise + weave_x + weave_y, 0.45, 0.92)
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, :3] = rgb

    img = bpy.data.images.new("LimoonBoucleTex", width=w, height=h)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


def make_geo_pillow_texture():
    """Generate the geometric diamond/triangle beige-brown-cream pattern seen on the throw pillows."""
    w, h = 256, 256
    rgba = np.ones((h, w, 4), dtype=np.float32)
    y, x = np.mgrid[0:h, 0:w]
    u = (x / 64.0) % 1.0
    v = (y / 64.0) % 1.0
    d1 = np.abs(u - 0.5) + np.abs(v - 0.5)
    # 3 tones: cream, warm taupe, dark walnut brown
    cream = np.array([0.89, 0.83, 0.74], dtype=np.float32)
    taupe = np.array([0.62, 0.50, 0.40], dtype=np.float32)
    dark = np.array([0.28, 0.20, 0.15], dtype=np.float32)

    rgb = np.where(d1[:, :, None] < 0.28, dark, np.where(d1[:, :, None] < 0.48, cream, taupe))
    # Diagonal stripe accent
    stripe = np.abs(((x + y) % 64) - 32) < 4
    rgb = np.where(stripe[:, :, None], dark, rgb)
    rgba[:, :, :3] = rgb

    img = bpy.data.images.new("LimoonPillowGeoTex", width=w, height=h)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


def create_materials():
    mats = {}

    # 1. Oatmeal Boucle Fabric
    m_fab = bpy.data.materials.new("LimoonBoucle")
    m_fab.use_nodes = True
    bsdf = m_fab.node_tree.nodes.get("Principled BSDF")
    tex_node = m_fab.node_tree.nodes.new("ShaderNodeTexImage")
    tex_node.image = make_boucle_texture()
    m_fab.node_tree.links.new(bsdf.inputs["Base Color"], tex_node.outputs["Color"])
    bsdf.inputs["Roughness"].default_value = 0.86
    mats["fabric"] = m_fab

    # 2. Dark Walnut Plinth Base (Baza Şeridi)
    m_plinth = bpy.data.materials.new("LimoonWalnutPlinth")
    m_plinth.use_nodes = True
    bsdf = m_plinth.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.24, 0.16, 0.12, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.55
    mats["plinth"] = m_plinth

    # 3. Warm Cherry/Walnut Wood (Legs & Signature Oval Armrest Capsule)
    m_wood = bpy.data.materials.new("LimoonWarmWood")
    m_wood.use_nodes = True
    bsdf = m_wood.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.48, 0.25, 0.11, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.34
    mats["wood"] = m_wood

    # 4. Geometric Throw Pillow
    m_pil = bpy.data.materials.new("LimoonGeoPillow")
    m_pil.use_nodes = True
    bsdf = m_pil.node_tree.nodes.get("Principled BSDF")
    ptex = m_pil.node_tree.nodes.new("ShaderNodeTexImage")
    ptex.image = make_geo_pillow_texture()
    m_pil.node_tree.links.new(bsdf.inputs["Base Color"], ptex.outputs["Color"])
    bsdf.inputs["Roughness"].default_value = 0.78
    mats["pillow"] = m_pil

    # 5. Smoked Tempered Glass (Coffee Table Top)
    m_glass = bpy.data.materials.new("LimoonSmokedGlass")
    m_glass.use_nodes = True
    bsdf = m_glass.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.16, 0.17, 0.18, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.15
    bsdf.inputs["Roughness"].default_value = 0.08
    bsdf.inputs["Alpha"].default_value = 0.72
    m_glass.blend_method = 'BLEND'
    mats["glass"] = m_glass

    return mats


def add_bevel_box(name, size_xyz, loc_xyz, mat, bevel_width=0.04, segments=3, rot_xyz=(0, 0, 0)):
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

    # Auto UV unwrap for texture mapping
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cube_project(cube_size=0.6)
    bpy.ops.object.mode_set(mode='OBJECT')

    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.append(mat)
    return obj


def build_limoon_sofa(mats, total_width=2.36, prefix="Sofa3", offset_x=0.0, offset_z=0.0, rot_y=0.0):
    """Build the exact Limoon sofa from photos:
    - Warm wooden block legs (left, center, right)
    - Dark walnut rounded plinth base strip
    - Two deep plush seat cushions
    - Sloped side walls + rolled pillow-top armrests with signature oval warm-wood front inserts
    - Two rounded back cushions with center button dimple + geometric throw pillows
    """
    parent = bpy.data.objects.new(f"{prefix}_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)
    parent.rotation_euler = (0.0, 0.0, rot_y)

    parts = []
    depth = 0.98
    leg_h = 0.11

    # 1. Five wooden block legs (front-left, front-center, front-right, back-left, back-right)
    leg_positions = [
        (-total_width * 0.42, -depth * 0.34),
        (0.0, -depth * 0.34),
        (total_width * 0.42, -depth * 0.34),
        (-total_width * 0.42, depth * 0.34),
        (total_width * 0.42, depth * 0.34),
    ]
    for idx, (lx, ly) in enumerate(leg_positions):
        leg = add_bevel_box(f"{prefix}_Leg_{idx}", (0.065, 0.085, leg_h), (lx, ly, leg_h / 2), mats["wood"], bevel_width=0.01)
        parts.append(leg)

    # 2. Dark Walnut Plinth Base (Baza Şeridi)
    plinth_h = 0.055
    plinth = add_bevel_box(
        f"{prefix}_Plinth",
        (total_width * 0.98, depth * 0.94, plinth_h),
        (0.0, 0.0, leg_h + plinth_h / 2),
        mats["plinth"],
        bevel_width=0.022
    )
    parts.append(plinth)

    # 3. Two Wide Plush Seat Cushions (Monoblock-style deep rounded front)
    seat_h = 0.25
    seat_z = leg_h + plinth_h + seat_h / 2
    half_w = (total_width * 0.99) / 2.0
    for s_idx, sx in enumerate([-half_w / 2.0, half_w / 2.0]):
        seat = add_bevel_box(
            f"{prefix}_Seat_{s_idx}",
            (half_w - 0.008, depth * 0.95, seat_h),
            (sx, -0.01, seat_z),
            mats["fabric"],
            bevel_width=0.065,
            segments=4
        )
        parts.append(seat)

    # 4. Fluted Lower Back Frame
    back_z = leg_h + plinth_h + seat_h + 0.18
    back_frame = add_bevel_box(
        f"{prefix}_BackFrame",
        (total_width * 0.94, 0.18, 0.38),
        (0.0, depth * 0.38, back_z),
        mats["fabric"],
        bevel_width=0.055,
        segments=3
    )
    parts.append(back_frame)

    # 5. Two Plush Back Cushions with subtle forward tilt
    inner_w = total_width - 0.52
    bc_w = inner_w / 2.0
    for b_idx, bx in enumerate([-bc_w / 2.0, bc_w / 2.0]):
        bc = add_bevel_box(
            f"{prefix}_BackCushion_{b_idx}",
            (bc_w - 0.015, 0.20, 0.42),
            (bx, depth * 0.24, leg_h + plinth_h + seat_h + 0.19),
            mats["fabric"],
            bevel_width=0.075,
            segments=4,
            rot_xyz=(math.radians(8), 0, 0)
        )
        parts.append(bc)
        # Subtle center button tuft dimple accent
        tuft = add_bevel_box(
            f"{prefix}_Tuft_{b_idx}",
            (0.028, 0.02, 0.028),
            (bx, depth * 0.135, leg_h + plinth_h + seat_h + 0.21),
            mats["plinth"],
            bevel_width=0.008
        )
        parts.append(tuft)

    # 6. Signature Sloped Armrests + Rolled Pillow-Top + Front Oval Walnut Wood Capsule Insert!
    arm_w = 0.24
    for side_idx, sign in enumerate([-1.0, 1.0]):
        ax = sign * (total_width / 2.0 - arm_w / 2.0 - 0.01)
        # Sloped outer arm support
        arm_base = add_bevel_box(
            f"{prefix}_ArmBase_{side_idx}",
            (arm_w, depth * 0.84, 0.22),
            (ax, 0.04, leg_h + plinth_h + seat_h + 0.09),
            mats["fabric"],
            bevel_width=0.06,
            segments=4
        )
        parts.append(arm_base)

        # Signature Oval Warm-Wood Insert embedded inside the front face of each armrest!
        wood_insert = add_bevel_box(
            f"{prefix}_ArmWoodInsert_{side_idx}",
            (arm_w * 0.56, 0.06, 0.058),
            (ax, -depth * 0.36, leg_h + plinth_h + seat_h + 0.095),
            mats["wood"],
            bevel_width=0.024,
            segments=3
        )
        parts.append(wood_insert)

        # Geometric Throw Pillow leaning against each armrest
        px = sign * (total_width / 2.0 - arm_w - 0.13)
        pillow = add_bevel_box(
            f"{prefix}_ThrowPillow_{side_idx}",
            (0.36, 0.13, 0.36),
            (px, depth * 0.06, leg_h + plinth_h + seat_h + 0.17),
            mats["pillow"],
            bevel_width=0.055,
            segments=3,
            rot_xyz=(math.radians(12), math.radians(-sign * 18), math.radians(sign * 14))
        )
        parts.append(pillow)

    for p in parts:
        p.parent = parent
    return parent


def build_limoon_berjer(mats, offset_x=0.0, offset_z=0.0, rot_y=0.0):
    """Build the exact Limoon Tekli Berjer from Image 1 & 6:
    - Thick rounded seat cushion
    - Curved wrap-around tub backrest & sloped armrests
    - Exposed warm walnut corner legs rising along the lower base
    """
    parent = bpy.data.objects.new("Berjer_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)
    parent.rotation_euler = (0.0, 0.0, rot_y)

    parts = []
    w, d = 0.86, 0.86

    # 4 Exposed Walnut Corner Legs (front legs rise slightly higher onto the front corners as in Image 1)
    for idx, (lx, ly, lh) in enumerate([
        (-w * 0.39, -d * 0.38, 0.24),
        (w * 0.39, -d * 0.38, 0.24),
        (-w * 0.39, d * 0.38, 0.22),
        (w * 0.39, d * 0.38, 0.22),
    ]):
        leg = add_bevel_box(f"Berjer_Leg_{idx}", (0.055, 0.065, lh), (lx, ly, lh / 2.0), mats["wood"], bevel_width=0.012)
        parts.append(leg)

    # Lower upholstered apron
    apron = add_bevel_box("Berjer_Apron", (w * 0.88, d * 0.88, 0.12), (0, 0, 0.16), mats["fabric"], bevel_width=0.03)
    parts.append(apron)

    # Thick Plush Seat Cushion
    seat = add_bevel_box("Berjer_Seat", (w * 0.84, d * 0.86, 0.24), (0, -0.02, 0.31), mats["fabric"], bevel_width=0.065, segments=4)
    parts.append(seat)

    # Curved Backrest
    back = add_bevel_box(
        "Berjer_Back",
        (w * 0.92, 0.20, 0.48),
        (0, d * 0.32, 0.56),
        mats["fabric"],
        bevel_width=0.075,
        segments=4,
        rot_xyz=(math.radians(6), 0, 0)
    )
    parts.append(back)

    # Wrap-around Sloped Side Armrests
    for idx, sign in enumerate([-1.0, 1.0]):
        arm = add_bevel_box(
            f"Berjer_Arm_{idx}",
            (0.16, d * 0.84, 0.38),
            (sign * (w * 0.39), 0.02, 0.46),
            mats["fabric"],
            bevel_width=0.055,
            segments=4,
            rot_xyz=(math.radians(-6), 0, 0)
        )
        parts.append(arm)

    for p in parts:
        p.parent = parent
    return parent


def build_limoon_coffee_table(mats, offset_x=0.0, offset_z=0.0):
    """Build the exact Limoon Smoked-Glass & Walnut Coffee Table from Image 5."""
    parent = bpy.data.objects.new("CoffeeTable_Root", None)
    bpy.context.collection.objects.link(parent)
    parent.location = (offset_x, offset_z, 0.0)

    parts = []
    w, d, h = 1.24, 0.72, 0.42

    # 4 Walnut Vertical Legs
    for idx, (lx, ly) in enumerate([
        (-w * 0.36, -d * 0.36),
        (w * 0.36, -d * 0.36),
        (-w * 0.36, d * 0.36),
        (w * 0.36, d * 0.36),
    ]):
        leg = add_bevel_box(f"CT_Leg_{idx}", (0.048, 0.048, h - 0.02), (lx, ly, (h - 0.02) / 2.0), mats["wood"], bevel_width=0.008)
        parts.append(leg)

    # Lower Slatted Wooden Shelf
    shelf_z = 0.13
    for s_idx in range(5):
        sy = -d * 0.28 + s_idx * (d * 0.14)
        slat = add_bevel_box(f"CT_Slat_{s_idx}", (w * 0.74, 0.06, 0.022), (0, sy, shelf_z), mats["wood"], bevel_width=0.005)
        parts.append(slat)

    # Upper Wooden Crossbars
    for idx, sy in enumerate([-d * 0.36, d * 0.36]):
        bar = add_bevel_box(f"CT_Bar_{idx}", (w * 0.76, 0.04, 0.035), (0, sy, h - 0.035), mats["wood"], bevel_width=0.006)
        parts.append(bar)

    # Smoked Tempered Glass Top
    glass = add_bevel_box("CT_GlassTop", (w, d, 0.018), (0, 0, h - 0.009), mats["glass"], bevel_width=0.006)
    parts.append(glass)

    for p in parts:
        p.parent = parent
    return parent


def export_glb(filename):
    path = os.path.join(OUT_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        export_apply=True,
        export_materials='EXPORT',
    )
    print("EXPORTED_GLB:", path, os.path.getsize(path))


# 1. Export Individual 3'lü Koltuk
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=2.36, prefix="Limoon3Lu")
export_glb("limoon-3lu-koltuk.glb")
# Also overwrite GlamVelvetSofa.glb so every existing 3'lü Koltuk reference upgrades to the Limoon sofa!
export_glb("GlamVelvetSofa.glb")

# 2. Export Individual 2'li Koltuk
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=1.96, prefix="Limoon2Li")
export_glb("limoon-2li-koltuk.glb")

# 3. Export Individual Tekli Berjer
clear_scene()
mats = create_materials()
build_limoon_berjer(mats)
export_glb("limoon-berjer.glb")

# 4. Export Individual Orta Sehpa
clear_scene()
mats = create_materials()
build_limoon_coffee_table(mats)
export_glb("limoon-orta-sehpa.glb")
export_glb("orta-sehpa.glb")

# 5. Export Full Living Room Set (matching Image 5 layout!) + render verification screenshot
clear_scene()
mats = create_materials()
build_limoon_sofa(mats, total_width=2.36, prefix="MainSofa3", offset_x=0.0, offset_z=1.35, rot_y=0.0)
build_limoon_sofa(mats, total_width=1.96, prefix="SideSofa2", offset_x=-1.75, offset_z=-0.05, rot_y=math.radians(-90))
build_limoon_berjer(mats, offset_x=1.65, offset_z=-0.10, rot_y=math.radians(65))
build_limoon_coffee_table(mats, offset_x=0.0, offset_z=0.10)
export_glb("limoon-koltuk-tam-takim.glb")
export_glb("oturma-grubu-tam-takim.glb")

# Quick studio render to verify 3D geometry visually
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
scene.render.resolution_x = 1200
scene.render.resolution_y = 800

bpy.ops.object.camera_add(location=(0.2, -4.2, 2.2), rotation=(math.radians(66), 0, math.radians(3)))
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

preview_path = os.path.join(SCRATCH_DIR, "limoon_3d_set_preview.png")
scene.render.filepath = preview_path
bpy.ops.render.render(write_still=True)
print("PREVIEW_RENDERED:", preview_path)
