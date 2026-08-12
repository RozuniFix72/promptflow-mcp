"""Generate a terminal-style demo.gif for promptflow-mcp."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parent / "demo.gif"

W, H = 640, 200
BG = (18, 18, 24)
FG = (220, 220, 225)
ACCENT = (108, 92, 231)
GREEN = (80, 200, 120)
DIM = (120, 120, 130)

try:
    FONT = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 16)
except Exception:
    FONT = ImageFont.load_default()

LINES = [
    ("$", " node dist/index.js"),
    ("promptflow-mcp", " connected"),
    ("$", " prompt.save name=code-review body=\"Review {{diff}}\""),
    ("ok", "  saved code-review (v1)"),
    ("$", " prompt.list"),
    ("ok", "  code-review  v1  [review]"),
    ("$", " prompt.get id=.. vars={diff: \"...\"}"),
    ("ok", "  Review ..."),
]

def frame(step):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # title bar
    d.rectangle([0, 0, W, 28], fill=(30, 30, 40))
    d.ellipse([10, 10, 18, 18], fill=(255, 95, 86))
    d.ellipse([24, 10, 32, 18], fill=(255, 189, 46))
    d.ellipse([38, 10, 46, 18], fill=(39, 201, 63))
    d.text((W // 2 - 60, 6), "promptflow-mcp — demo", font=FONT, fill=DIM)
    # body: reveal lines progressively
    y = 42
    for i, (tag, text) in enumerate(LINES):
        if i > step:
            break
        if tag == "$":
            d.text((12, y), "$", font=FONT, fill=GREEN)
            d.text((28, y), text, font=FONT, fill=FG)
        elif tag == "ok":
            d.text((28, y), text, font=FONT, fill=ACCENT)
        else:
            d.text((28, y), text, font=FONT, fill=FG)
        y += 20
    # blinking cursor
    if step % 2 == 0:
        d.rectangle([28 + 8 * len(LINES[min(step, len(LINES) - 1)][1]), y - 18, 34 + 8 * len(LINES[min(step, len(LINES) - 1)][1]), y - 10], fill=FG)
    return img

frames = []
for step in range(len(LINES) * 2 + 2):
    frames.append(frame(step))
frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=500,
    loop=0,
)
print("demo.gif written:", len(frames), "frames")
