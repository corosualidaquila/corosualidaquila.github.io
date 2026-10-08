"""Crea il breve video di Ottavio che vola e atterra."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw
import imageio_ffmpeg


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUTPUT = ASSETS / "ottavio-vola-e-atterra.mp4"
WIDTH, HEIGHT, FPS, DURATION = 960, 540, 24, 4.7


def sprite(name: str) -> Image.Image:
    picture = Image.open(ASSETS / name).convert("RGBA")
    return picture.crop(picture.getbbox())


FLIGHT_UP = sprite("ottavio-volo-su.png")
FLIGHT_DOWN = sprite("ottavio-volo-giu.png")
HERO = sprite("aquila-supereroe.png")


def make_background() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()
    for y in range(HEIGHT):
        mix = y / HEIGHT
        shade = (int(151 + 82 * mix), int(211 + 34 * mix), int(248 - 17 * mix))
        for x in range(WIDTH):
            pixels[x, y] = shade
    drawing = ImageDraw.Draw(image)
    drawing.ellipse((740, -80, 1030, 210), fill=(255, 245, 185))
    drawing.ellipse((-120, 466, 1090, 730), fill=(121, 187, 145))
    drawing.ellipse((275, 478, 685, 530), fill=(91, 153, 121))
    return image.convert("RGBA")


BACKGROUND = make_background()


def draw_clouds(frame: Image.Image, time: float) -> None:
    drawing = ImageDraw.Draw(frame, "RGBA")
    for start_x, y, size, speed in ((95, 95, 1.0, 12), (500, 64, .7, -9), (770, 205, .9, 8)):
        x = start_x + speed * time
        w, h = int(160 * size), int(54 * size)
        drawing.ellipse((x, y + h // 4, x + w, y + h), fill=(255, 255, 255, 104))
        drawing.ellipse((x + w * .16, y, x + w * .58, y + h * .86), fill=(255, 255, 255, 104))


def place(frame: Image.Image, picture: Image.Image, cx: float, cy: float, width: float,
          angle: float = 0, opacity: float = 1, height_scale: float = 1) -> None:
    target_width = max(1, int(width))
    target_height = max(1, int(target_width * picture.height / picture.width * height_scale))
    image = picture.resize((target_width, target_height), Image.Resampling.LANCZOS)
    if angle:
        image = image.rotate(angle, Image.Resampling.BICUBIC, expand=True)
    if opacity < 1:
        image.putalpha(image.getchannel("A").point(lambda value: int(value * opacity)))
    x, y = int(cx - image.width / 2), int(cy - image.height / 2)
    frame.alpha_composite(image, (x, y))


def draw_music(frame: Image.Image, time: float) -> None:
    drawing = ImageDraw.Draw(frame, "RGBA")
    for index, (x, y) in enumerate(((740, 175), (785, 263), (188, 166))):
        appear = max(0, min(1, (time - 2.25 - index * .2) * 3))
        fade = max(0, min(1, (4.5 - time) * 2))
        alpha = int(210 * appear * fade)
        if alpha:
            yy = y - int(max(0, time - 2.4) * (15 + index * 4))
            drawing.ellipse((x, yy + 20, x + 22, yy + 35), fill=(38, 107, 203, alpha))
            drawing.line((x + 20, yy + 27, x + 20, yy - 3), fill=(38, 107, 203, alpha), width=6)
            drawing.arc((x + 18, yy - 7, x + 43, yy + 15), 275, 70, fill=(38, 107, 203, alpha), width=6)


def render_frame(time: float) -> Image.Image:
    frame = BACKGROUND.copy()
    draw_clouds(frame, time)
    drawing = ImageDraw.Draw(frame, "RGBA")

    if time < 2.45:
        progress = min(1, time / 2.35)
        eased = 1 - (1 - progress) ** 2.2
        cx = -180 + 660 * eased
        cy = 225 - 86 * math.sin(progress * math.pi) + 14 * math.sin(time * 11)
        width = 300 + 170 * progress
        angle = -12 + 11 * progress
        wing = FLIGHT_UP if int(time * 5.5) % 2 == 0 else FLIGHT_DOWN
        opacity = 1 if time < 2.22 else max(0, (2.45 - time) / .23)
        place(frame, wing, cx, cy, width, angle, opacity)

    if time >= 2.20:
        landing = max(0, min(1, (time - 2.20) / .32))
        shadow_width = 165 + 80 * landing
        drawing.ellipse((480 - shadow_width, 482, 480 + shadow_width, 512), fill=(40, 92, 70, int(58 * landing)))
        bounce = -25 * math.exp(-5 * max(0, time - 2.47)) * abs(math.sin((time - 2.47) * 12)) if time > 2.47 else -85 * (1 - landing)
        squeeze = 1 - .06 * math.exp(-9 * abs(time - 2.54))
        place(frame, HERO, 480, 290 + bounce, 440 + 22 * landing, 0, landing, squeeze)
        if 2.35 < time < 3.15:
            burst = max(0, 1 - abs(time - 2.70) / .45)
            for direction in (-1, 1):
                x = 480 + direction * (160 + (time - 2.35) * 85)
                drawing.ellipse((x - 16, 475 - burst * 18, x + 16, 491), fill=(255, 255, 255, int(130 * burst)))

    draw_music(frame, time)
    return frame.convert("RGB")


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [ffmpeg, "-y", "-f", "rawvideo", "-pixel_format", "rgb24", "-video_size",
               f"{WIDTH}x{HEIGHT}", "-framerate", str(FPS), "-i", "-", "-an", "-c:v",
               "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
               "-movflags", "+faststart", str(OUTPUT)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        assert process.stdin is not None
        for number in range(int(DURATION * FPS)):
            process.stdin.write(render_frame(number / FPS).tobytes())
        process.stdin.close()
        assert process.stderr is not None
        errors = process.stderr.read().decode("utf-8", errors="replace")
        if process.wait() != 0:
            raise RuntimeError(errors[-3000:])
    finally:
        if process.poll() is None:
            process.kill()
    print(OUTPUT)


if __name__ == "__main__":
    main()
