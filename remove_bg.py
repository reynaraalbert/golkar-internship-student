import sys
import math
from PIL import Image

def remove_background(image_path: str, output_path: str, tolerance: int = 50) -> None:
    img = Image.open(image_path).convert("RGBA")
    
    # Safely sample top-left pixel as background color
    bg_color = img.getpixel((0, 0))
    data = list(img.getdata())
    
    new_data = []
    for item in data:
        # Calculate color distance for (R, G, B)
        dist = math.sqrt(
            (item[0] - bg_color[0]) ** 2 +
            (item[1] - bg_color[1]) ** 2 +
            (item[2] - bg_color[2]) ** 2
        )
        
        if dist < tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input_image> <output_image> [tolerance]")
        sys.exit(1)
        
    img_path = sys.argv[1]
    out_path = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    remove_background(img_path, out_path, tol)

