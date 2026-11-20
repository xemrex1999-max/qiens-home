import bpy
import sys
import os

# Usage: blender.exe --background --python blender-clean.py -- input.glb output.glb

def clean_and_optimize():
    argv = sys.argv
    if "--" not in argv:
        print("Error: Missing '--' separator in arguments")
        return
    args = argv[argv.index("--") + 1:]
    if len(args) < 2:
        print("Usage: blender.exe --background --python blender-clean.py -- <input_file> <output_file>")
        return

    input_path = os.path.abspath(args[0])
    output_path = os.path.abspath(args[1])

    print(f"Loading model: {input_path}")
    
    # Clear default scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Import
    ext = os.path.splitext(input_path)[1].lower()
    if ext in ['.glb', '.gltf']:
        bpy.ops.import_scene.gltf(filepath=input_path)
    elif ext == '.obj':
        bpy.ops.wm.obj_import(filepath=input_path)
    elif ext == '.fbx':
        bpy.ops.import_scene.fbx(filepath=input_path)
    else:
        print(f"Unsupported format: {ext}")
        return

    # Process all mesh objects
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)

            # Recalculate normals outside
            bpy.ops.object.mode_set(mode='EDIT')
            bpy.ops.mesh.select_all(action='SELECT')
            bpy.ops.mesh.normals_make_consistent(inside=False)
            bpy.ops.mesh.remove_doubles(threshold=0.001)
            bpy.ops.object.mode_set(mode='OBJECT')

            # Add smooth shading
            bpy.ops.object.shade_smooth()

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Export to GLB
    print(f"Exporting optimized model to: {output_path}")
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_materials='EXPORT',
        export_image_format='AUTO'
    )
    print("Optimization and export complete!")

if __name__ == "__main__":
    clean_and_optimize()
