import base64
import os
import random
import string

from ....core.utils.lazy_import import lazy_import
from ....terminal_interface.utils.local_storage_path import get_storage_path

# Lazy import html2image so environments without it can still import this module
html2image = lazy_import("html2image")


def html_to_png_base64(code):
    # If html2image is available, use it to render HTML to an image
    if html2image is not None:
        hti = html2image.Html2Image()

        # Generate a random filename for the temporary image
        temp_filename = "".join(random.choices(string.digits, k=10)) + ".png"
        hti.output_path = get_storage_path()
        hti.screenshot(
            html_str=code,
            save_as=temp_filename,
            size=(960, 540),
        )

        # Get the full path of the temporary image file
        file_location = os.path.join(get_storage_path(), temp_filename)

        # Convert the image to base64
        with open(file_location, "rb") as image_file:
            screenshot_base64 = base64.b64encode(image_file.read()).decode()

        # Delete the temporary image file
        os.remove(file_location)
        return screenshot_base64

    # Fallback: generate a simple placeholder PNG using Pillow
    from PIL import Image, ImageDraw

    width, height = 960, 540
    image = Image.new("RGB", (width, height), color=(30, 30, 30))
    draw = ImageDraw.Draw(image)
    placeholder_text = "html2image not installed. Rendering placeholder."
    draw.text((20, height // 2 - 10), placeholder_text, fill=(200, 200, 200))

    temp_filename = "".join(random.choices(string.digits, k=10)) + ".png"
    file_location = os.path.join(get_storage_path(), temp_filename)
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    image.save(file_location, format="PNG")

    with open(file_location, "rb") as image_file:
        screenshot_base64 = base64.b64encode(image_file.read()).decode()

    os.remove(file_location)
    return screenshot_base64
