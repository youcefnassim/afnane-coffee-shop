import os
import glob
from PIL import Image
import pillow_heif

source_dir = r"d:\Afnane coffee shop\afnane-coffee\afnene photo"
target_dir = r"d:\Afnane coffee shop\afnane-coffee\public\images\gallery"

os.makedirs(target_dir, exist_ok=True)

# Register HEIF opener
pillow_heif.register_heif_opener()

heic_files = glob.glob(os.path.join(source_dir, "*.HEIC"))
for heic_file in heic_files:
    filename = os.path.basename(heic_file)
    name, ext = os.path.splitext(filename)
    target_file = os.path.join(target_dir, f"{name}.jpg")
    
    print(f"Converting {filename} to JPG...")
    image = Image.open(heic_file)
    image.save(target_file, "JPEG")

print("Conversion complete.")
