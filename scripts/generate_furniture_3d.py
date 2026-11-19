import bpy
import math
import os

OUT_DIRS = [
    r"C:\Users\HP\Desktop\WEB SİTESİ\qiens-home\public\models",
    r"C:\Users\HP\Desktop\WEB SİTESİ\qiens-home\models"
]
for d in OUT_DIRS:
    os.makedirs(d, exist_ok=True)

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def make_mat(name, color, roughness=0.5, metallic=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
    return mat

def get_materials():
    return {
        "wood": make_mat("Wood_Walnut", (0.24, 0.14, 0.08), roughness=0.45, metallic=0.02),
        "oak": make_mat("Wood_Oak", (0.58, 0.44, 0.29), roughness=0.50, metallic=0.0),
        "fabric": make_mat("Fabric_Cream", (0.85, 0.80, 0.72), roughness=0.85, metallic=0.0),
        "fabric_accent": make_mat("Fabric_Velvet", (0.12, 0.28, 0.20), roughness=0.78, metallic=0.02),
        "pillow": make_mat("Fabric_Pillow", (0.94, 0.92, 0.88), roughness=0.88, metallic=0.0),
        "gold": make_mat("Metal_Gold", (0.83, 0.67, 0.28), roughness=0.22, metallic=0.92),
        "mirror": make_mat("Glass_Mirror", (0.82, 0.88, 0.92), roughness=0.05, metallic=0.95),
        "marble": make_mat("Marble_White", (0.92, 0.91, 0.89), roughness=0.18, metallic=0.04),
        "rug": make_mat("Rug_Beige", (0.76, 0.71, 0.63), roughness=0.95, metallic=0.0),
        "lamp": make_mat("Lamp_Warm", (0.98, 0.91, 0.75), roughness=0.4, metallic=0.0),
    }

def add_box(name, size, loc, mat, rot=(0, 0, 0), bevel=0.012):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0], size[1], size[2])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = obj.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = min(bevel, min(size) * 0.25)
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
    obj.data.materials.append(mat)
    return obj

def add_cyl(name, radius, depth, loc, mat, rot=(0, 0, 0), verts=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    return obj

# --- FURNITURE BUILDERS (meters) ---
def build_bed(mats, ox=0, oy=0, rot_z=0):
    objs = []
    # Base / Baza
    objs.append(add_box("Bed_Base", (1.72, 2.08, 0.30), (0, 0, 0.21), mats["fabric"]))
    # 4 Gold legs
    for sx in (-0.78, 0.78):
        for sy in (-0.95, 0.95):
            objs.append(add_cyl("Bed_Leg", 0.025, 0.08, (sx, sy, 0.04), mats["gold"]))
    # Headboard (Tufted panels + gold frame)
    objs.append(add_box("Bed_Headboard_Frame", (1.84, 0.10, 1.24), (0, -1.03, 0.62), mats["wood"], bevel=0.015))
    for i in range(4):
        px = -0.63 + i * 0.42
        objs.append(add_box(f"Bed_Head_Panel_{i}", (0.39, 0.06, 1.06), (px, -0.96, 0.66), mats["fabric"], bevel=0.02))
    objs.append(add_box("Bed_Head_Gold_Trim", (1.86, 0.02, 0.03), (0, -0.97, 1.22), mats["gold"], bevel=0.004))
    # Mattress
    objs.append(add_box("Bed_Mattress", (1.64, 2.00, 0.24), (0, 0.01, 0.48), mats["pillow"], bevel=0.04))
    # Duvet / Runner
    objs.append(add_box("Bed_Duvet", (1.68, 1.38, 0.26), (0, 0.32, 0.49), mats["fabric_accent"], bevel=0.05))
    # Pillows
    for sx in (-0.42, 0.42):
        objs.append(add_box("Bed_Pillow_Back", (0.68, 0.42, 0.16), (sx, -0.72, 0.66), mats["pillow"], rot=(0.25, 0, 0), bevel=0.04))
        objs.append(add_box("Bed_Pillow_Front", (0.45, 0.30, 0.13), (sx * 0.85, -0.52, 0.64), mats["fabric_accent"], rot=(0.35, 0, 0), bevel=0.03))
    apply_group_transform(objs, ox, oy, rot_z)

def build_nightstand(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("NS_Body", (0.54, 0.44, 0.36), (0, 0, 0.30), mats["wood"], bevel=0.01))
    objs.append(add_box("NS_Top", (0.56, 0.46, 0.025), (0, 0, 0.49), mats["marble"], bevel=0.006))
    for i, z in enumerate((0.22, 0.38)):
        objs.append(add_box(f"NS_Drawer_{i}", (0.48, 0.02, 0.13), (0, 0.225, z), mats["oak"], bevel=0.004))
        objs.append(add_box(f"NS_Handle_{i}", (0.14, 0.02, 0.015), (0, 0.245, z), mats["gold"], bevel=0.002))
    for sx in (-0.22, 0.22):
        for sy in (-0.17, 0.17):
            objs.append(add_cyl("NS_Leg", 0.015, 0.12, (sx, sy, 0.06), mats["gold"]))
    # Lamp
    objs.append(add_cyl("Lamp_Base", 0.06, 0.03, (0, 0, 0.52), mats["gold"]))
    objs.append(add_cyl("Lamp_Stem", 0.012, 0.22, (0, 0, 0.64), mats["gold"]))
    objs.append(add_cyl("Lamp_Shade", 0.11, 0.16, (0, 0, 0.78), mats["lamp"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_wardrobe(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("WR_Main", (2.40, 0.60, 2.12), (0, 0, 1.08), mats["wood"], bevel=0.012))
    objs.append(add_box("WR_Plinth", (2.36, 0.56, 0.08), (0, 0, 0.04), mats["gold"], bevel=0.005))
    # 6 Doors (middle 2 mirrored)
    for i in range(6):
        dx = -1.00 + i * 0.40
        is_mirror = (i == 2 or i == 3)
        door_mat = mats["mirror"] if is_mirror else mats["oak"]
        objs.append(add_box(f"WR_Door_{i}", (0.385, 0.025, 2.02), (dx, 0.305, 1.10), door_mat, bevel=0.004))
        hx = dx + (0.15 if i % 2 == 0 else -0.15)
        objs.append(add_box(f"WR_Handle_{i}", (0.018, 0.025, 0.42), (hx, 0.325, 1.05), mats["gold"], bevel=0.003))
    apply_group_transform(objs, ox, oy, rot_z)

def build_dresser(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("DR_Body", (1.24, 0.46, 0.62), (0, 0, 0.47), mats["wood"], bevel=0.012))
    objs.append(add_box("DR_Top", (1.26, 0.48, 0.028), (0, 0, 0.79), mats["marble"], bevel=0.006))
    for col in (-0.30, 0.30):
        for row in (0.28, 0.47, 0.66):
            objs.append(add_box("DR_Drawer", (0.56, 0.02, 0.16), (col, 0.235, row), mats["oak"], bevel=0.004))
            objs.append(add_box("DR_Handle", (0.16, 0.02, 0.015), (col, 0.255, row), mats["gold"], bevel=0.002))
    for sx in (-0.56, 0.56):
        for sy in (-0.18, 0.18):
            objs.append(add_cyl("DR_Leg", 0.018, 0.16, (sx, sy, 0.08), mats["gold"]))
    # Round Gold Mirror above dresser
    objs.append(add_cyl("DR_Mirror_Frame", 0.42, 0.03, (0, -0.18, 1.32), mats["gold"], rot=(math.pi/2, 0, 0), verts=36))
    objs.append(add_cyl("DR_Mirror_Glass", 0.39, 0.036, (0, -0.18, 1.32), mats["mirror"], rot=(math.pi/2, 0, 0), verts=36))
    apply_group_transform(objs, ox, oy, rot_z)

def build_pouf(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("Pouf_Seat", (1.28, 0.44, 0.18), (0, 0, 0.36), mats["fabric_accent"], bevel=0.04))
    objs.append(add_box("Pouf_Frame", (1.22, 0.38, 0.03), (0, 0, 0.26), mats["gold"], bevel=0.004))
    for sx in (-0.56, 0.56):
        for sy in (-0.16, 0.16):
            objs.append(add_cyl("Pouf_Leg", 0.015, 0.26, (sx, sy, 0.13), mats["gold"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_dining_table(mats, ox=0, oy=0, rot_z=0):
    objs = []
    # Marble top + gold edge
    objs.append(add_box("Table_Top", (2.05, 1.00, 0.055), (0, 0, 0.76), mats["marble"], bevel=0.015))
    objs.append(add_box("Table_Apron", (1.92, 0.88, 0.05), (0, 0, 0.71), mats["gold"], bevel=0.006))
    # Sculptural pedestal legs
    for sx in (-0.58, 0.58):
        objs.append(add_box("Table_Pedestal", (0.14, 0.56, 0.68), (sx, 0, 0.36), mats["wood"], bevel=0.02))
        objs.append(add_box("Table_Ped_Gold", (0.18, 0.60, 0.04), (sx, 0, 0.02), mats["gold"], bevel=0.006))
    apply_group_transform(objs, ox, oy, rot_z)

def build_chair(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("Chair_Seat", (0.48, 0.48, 0.08), (0, 0, 0.46), mats["fabric_accent"], bevel=0.025))
    objs.append(add_box("Chair_Back", (0.46, 0.08, 0.44), (0, -0.21, 0.71), mats["fabric_accent"], rot=(-0.10, 0, 0), bevel=0.025))
    for sx in (-0.20, 0.20):
        for sy in (-0.20, 0.20):
            objs.append(add_cyl("Chair_Leg", 0.016, 0.44, (sx, sy, 0.22), mats["gold"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_console(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("Con_Body", (2.08, 0.46, 0.58), (0, 0, 0.52), mats["wood"], bevel=0.012))
    objs.append(add_box("Con_Top", (2.10, 0.48, 0.03), (0, 0, 0.82), mats["marble"], bevel=0.006))
    for i in range(4):
        dx = -0.76 + i * 0.507
        objs.append(add_box(f"Con_Door_{i}", (0.48, 0.025, 0.52), (dx, 0.235, 0.52), mats["oak"], bevel=0.005))
        objs.append(add_cyl(f"Con_Knob_{i}", 0.022, 0.025, (dx, 0.255, 0.56), mats["gold"], rot=(math.pi/2, 0, 0)))
    for sx in (-0.94, 0, 0.94):
        for sy in (-0.18, 0.18):
            objs.append(add_cyl("Con_Leg", 0.018, 0.23, (sx, sy, 0.115), mats["gold"]))
    # Mirror above console
    objs.append(add_box("Con_Mirror_Frame", (1.35, 0.03, 0.72), (0, -0.18, 1.32), mats["gold"], bevel=0.008))
    objs.append(add_box("Con_Mirror_Glass", (1.28, 0.036, 0.65), (0, -0.18, 1.32), mats["mirror"], bevel=0.004))
    apply_group_transform(objs, ox, oy, rot_z)

def build_sofa(mats, length=2.30, ox=0, oy=0, rot_z=0):
    objs = []
    # Base
    objs.append(add_box("Sofa_Base", (length, 0.92, 0.16), (0, 0, 0.22), mats["wood"], bevel=0.015))
    # Backrest
    objs.append(add_box("Sofa_Back", (length, 0.22, 0.68), (0, -0.35, 0.56), mats["fabric_accent"], bevel=0.05))
    # Arms
    arm_x = length / 2 - 0.11
    for sx in (-arm_x, arm_x):
        objs.append(add_box("Sofa_Arm", (0.22, 0.90, 0.46), (sx, 0.01, 0.45), mats["fabric_accent"], bevel=0.045))
    # Seat Cushions
    num_c = 3 if length > 2.0 else 2
    cw = (length - 0.48) / num_c
    for i in range(num_c):
        cx = -(length - 0.48)/2 + cw/2 + i * cw
        objs.append(add_box(f"Sofa_Seat_{i}", (cw - 0.02, 0.72, 0.16), (cx, 0.10, 0.38), mats["fabric_accent"], bevel=0.04))
        objs.append(add_box(f"Sofa_Throw_{i}", (0.36, 0.14, 0.34), (cx, -0.14, 0.62), mats["pillow"], rot=(0.22, 0, 0.08 * (i-1)), bevel=0.03))
    # Legs
    for sx in (-length/2 + 0.14, length/2 - 0.14):
        for sy in (-0.36, 0.36):
            objs.append(add_cyl("Sofa_Leg", 0.02, 0.14, (sx, sy, 0.07), mats["gold"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_armchair(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("AC_Seat", (0.76, 0.76, 0.18), (0, 0.04, 0.38), mats["fabric"], bevel=0.04))
    objs.append(add_box("AC_Back", (0.76, 0.18, 0.66), (0, -0.32, 0.62), mats["fabric"], bevel=0.045))
    for sx in (-0.33, 0.33):
        objs.append(add_box("AC_Arm", (0.14, 0.74, 0.36), (sx, 0.02, 0.48), mats["fabric"], bevel=0.035))
    for sx in (-0.30, 0.30):
        for sy in (-0.30, 0.30):
            objs.append(add_cyl("AC_Leg", 0.018, 0.28, (sx, sy, 0.14), mats["gold"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_coffee_table(mats, ox=0, oy=0, rot_z=0):
    objs = []
    objs.append(add_box("CT_Top", (1.20, 0.68, 0.045), (0, 0, 0.40), mats["marble"], bevel=0.012))
    objs.append(add_box("CT_Shelf", (1.12, 0.60, 0.025), (0, 0, 0.16), mats["wood"], bevel=0.005))
    for sx in (-0.54, 0.54):
        for sy in (-0.28, 0.28):
            objs.append(add_cyl("CT_Leg", 0.015, 0.38, (sx, sy, 0.19), mats["gold"]))
    apply_group_transform(objs, ox, oy, rot_z)

def build_rug(mats, w, d, ox=0, oy=0):
    add_box("Room_Rug", (w, d, 0.012), (ox, oy, 0.006), mats["rug"], bevel=0.004)

def apply_group_transform(objs, ox, oy, rot_z_deg):
    rad = math.radians(rot_z_deg)
    cos_r = math.cos(rad)
    sin_r = math.sin(rad)
    for o in objs:
        lx, ly, lz = o.location
        nx = lx * cos_r - ly * sin_r + ox
        ny = lx * sin_r + ly * cos_r + oy
        o.location = (nx, ny, lz)
        o.rotation_euler[2] += rad

def export_glb(filename):
    for d in OUT_DIRS:
        path = os.path.join(d, filename)
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_materials='EXPORT')
    print("Exported:", filename)

# 1. FULL BEDROOM SET
clear_scene()
m = get_materials()
build_rug(m, 3.8, 3.2, 0.0, 0.2)
build_bed(m, ox=0.0, oy=-0.35, rot_z=0)
build_nightstand(m, ox=-1.26, oy=-1.05, rot_z=0)
build_nightstand(m, ox=1.26, oy=-1.05, rot_z=0)
build_pouf(m, ox=0.0, oy=1.05, rot_z=0)
build_wardrobe(m, ox=-2.25, oy=0.15, rot_z=90)
build_dresser(m, ox=2.15, oy=0.35, rot_z=-90)
export_glb("yatak-odasi-tam-takim.glb")

# 2. FULL DINING ROOM SET
clear_scene()
m = get_materials()
build_rug(m, 3.6, 2.8, 0.0, 0.1)
build_dining_table(m, ox=0.0, oy=0.2, rot_z=0)
for cx in (-0.62, 0.0, 0.62):
    build_chair(m, ox=cx, oy=-0.52, rot_z=0)
    build_chair(m, ox=cx, oy=0.92, rot_z=180)
build_console(m, ox=0.0, oy=-1.65, rot_z=0)
export_glb("yemek-odasi-tam-takim.glb")

# 3. FULL LIVING ROOM SET
clear_scene()
m = get_materials()
build_rug(m, 3.6, 2.8, 0.0, 0.1)
build_sofa(m, length=2.35, ox=0.0, oy=-1.20, rot_z=0)
build_sofa(m, length=1.90, ox=-1.65, oy=0.25, rot_z=90)
build_armchair(m, ox=1.55, oy=-0.10, rot_z=-75)
build_armchair(m, ox=1.45, oy=1.05, rot_z=-115)
build_coffee_table(m, ox=0.0, oy=0.18, rot_z=0)
export_glb("oturma-grubu-tam-takim.glb")

# 4. INDIVIDUAL PIECES FOR DRAG & DROP / 360 VIEW
for fname, fn in [
    ("gardirop.glb", lambda m: build_wardrobe(m)),
    ("yatak-baza.glb", lambda m: build_bed(m)),
    ("sifonyer.glb", lambda m: build_dresser(m)),
    ("komodin.glb", lambda m: build_nightstand(m)),
    ("yemek-masasi.glb", lambda m: build_dining_table(m)),
    ("konsol.glb", lambda m: build_console(m)),
    ("orta-sehpa.glb", lambda m: build_coffee_table(m)),
]:
    clear_scene()
    m = get_materials()
    fn(m)
    export_glb(fname)

print("ALL 10 LUXURY FURNITURE 3D GLB MODELS GENERATED SUCCESSFULLY!")
