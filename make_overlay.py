"""Crea l'animazione WebM trasparente di Ottavio per sovrapporla alla pagina."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw
import imageio_ffmpeg


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUTPUT = ASSETS / "ottavio-entrata-trasparente.webm"
WIDTH = HEIGHT = 800
FPS = 24
DURATION = 4.4


def load_sprite(name: str) -> Image.Image:
    image = Image.open(ASSETS / name).convert("RGBA")
    return image.crop(image.getbbox())


WINGS_UP = load_sprite("ottavio-volo-su.png")
WINGS_DOWN = load_sprite("ottavio-volo-giu.png")
HERO_POSE = load_sprite("aquila-supereroe.png")


def place(frame: Image.Image, image: Image.Image, center_x: float, center_y: float,
          width: int, angle: float = 0, opacity: float = 1,
          vertical_scale: float = 1) -> None:
    height = max(1, int(width * image.height / image.width * vertical_scale))
    sprite = image.resize((width, height), Image.Resampling.LANCZOS)
    if angle:
        sprite = sprite.rotate(angle, Image.Resampling.BICUBIC, expand=True)
    if opacity < 1:
        sprite.putalpha(sprite.getchannel("A").point(lambda value: round(value * opacity)))
    frame.alpha_composite(sprite, (round(center_x - sprite.width / 2), round(center_y - sprite.height / 2)))


def draw_note(draw: ImageDraw.ImageDraw, x: int, y: int, alpha: int, scale: float) -> None:
    blue = (41, 113, 220, alpha)
    radius = max(4, round(10 * scale))
    draw.ellipse((x, y, x + radius * 1.6, y + radius), fill=blue)
    stem_x = x + round(radius * 1.4)
    top = y - round(radius * 2.7)
    draw.line((stem_x, y + round(radius * .4), stem_x, top), fill=blue, width=max(3, round(4 * scale)))
    draw.arc((stem_x - round(radius * .1), top - round(radius * .2),
              stem_x + round(radius * 1.7), top + round(radius * 1.2)), 260, 95,
             fill=blue, width=max(3, round(4 * scale)))


def render_frame(time: float) -> Image.Image:
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame, "RGBA")

    if time < 2.65:
        progress = min(1, time / 2.65)
        eased = progress * progress * (3 - 2 * progress)
        x = -110 + 510 * eased
        y = 170 + 260 * eased - 54 * math.sin(math.pi * progress)
        size = round(270 + 110 * progress)
        angle = -16 + 13 * progress
        flapping_pose = WINGS_UP if int(time * 7) % 2 == 0 else WINGS_DOWN
        opacity = 1 if time < 2.43 else max(0, (2.65 - time) / .22)
        place(frame, flapping_pose, x, y, size, angle, opacity)

    if time >= 2.43:
        arrival = min(1, (time - 2.43) / .4)
        if arrival > 0:
            bounce = 0
            if time >= 2.83:
                elapsed = time - 2.83
                bounce = -34 * math.exp(-4.5 * elapsed) * math.sin(11 * elapsed)
            squash = 1 - .065 * math.exp(-((time - 2.9) / .1) ** 2)
            place(frame, HERO_POSE, 400, 535 + bounce, 445, 0, arrival, squash)

    if time >= 2.55:
        age = time - 2.55
        fade = max(0, min(1, (4.35 - time) / .5))
        for index, (origin_x, origin_y) in enumerate(((175, 335), (590, 300), (625, 450))):
            delay = index * .23
            age_note = age - delay
            if 0 <= age_note <= 1.25:
                alpha = round(210 * min(1, age_note * 4) * fade)
                x = origin_x + round(math.sin(age_note * 4 + index) * 10)
                y = origin_y - round(age_note * 42)
                draw_note(draw, x, y, alpha, .8 + index * .1)

    return frame


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [ffmpeg, "-y", "-f", "rawvideo", "-pixel_format", "rgba", "-video_size",
               f"{WIDTH}x{HEIGHT}", "-framerate", str(FPS), "-i", "-", "-an", "-c:v",
               "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0",
               "-crf", "30", "-deadline", "good", "-metadata:s:v:0", "alpha_mode=1",
               str(OUTPUT)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert process.stdin is not None
    for index in range(round(DURATION * FPS)):
        process.stdin.write(render_frame(index / FPS).tobytes())
    process.stdin.close()
    assert process.stderr is not None
    errors = process.stderr.read().decode("utf-8", errors="replace")
    if process.wait() != 0:
        raise RuntimeError(errors[-3000:])
    print(OUTPUT)


if __name__ == "__main__":
    main()
