#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dinç Diş Kliniği — bilgilendirme kartı görseli üreticisi
(Açık temalı, doğru Türkçe karakterlerle; PIL ile çizilir.)
Çalıştırma: python3 tools/build-info-card.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "/home/user/.fonts/Manrope.ttf"
W, H = 900, 1200

TEAL_D = (7, 86, 106)
TEAL = (11, 110, 134)
TEAL_L = (14, 147, 172)
INK = (23, 60, 48)
MUTED = (92, 147, 163)


def font(size, weight):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_name(weight)
    return f


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def tooth(size, color):
    import cairosvg
    path = f"/tmp/card_tooth_{size}_{color[0]}.png"
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
           '<path d="M12 3.2c-1.9 0-3.2-.9-5-.9C4.5 2.3 3 4.1 3 6.9c0 2.2.9 3.8 1.5 5.3'
           '.6 1.4.9 3 1.1 4.7.2 1.5.5 3.3 1.6 3.3 1.2 0 1.4-1.6 1.7-3.3'
           '.3-1.6.6-2.8 2.1-2.8s1.8 1.2 2.1 2.8c.3 1.7.5 3.3 1.7 3.3'
           f'1.1 0 1.4-1.8 1.6-3.3.2-1.7.5-3.3 1.1-4.7C18.1 10.7 19 9.1 19 6.9'
           'c0-2.8-1.5-4.6-4-4.6-1.8 0-3.1.9-5 .9z" fill="#%02x%02x%02x"/></svg>' % color)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=path, output_width=size, output_height=size)
    return Image.open(path).convert("RGBA")


def main():
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)

    # yumuşak dikey degrade
    top, bot = (234, 247, 252), (255, 255, 255)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(
            int(top[0] + (bot[0] - top[0]) * t ** 0.7),
            int(top[1] + (bot[1] - top[1]) * t ** 0.7),
            int(top[2] + (bot[2] - top[2]) * t ** 0.7)))

    # üst süsleme: turkuaz şerit + diş işareti
    d.rectangle([0, 0, W, 12], fill=TEAL)
    mark = tooth(84, TEAL)
    img.paste(mark, (72, 62), mark)

    f_h1 = font(50, "ExtraBold")
    f_sub = font(26, "Medium")
    f_head = font(30, "Bold")
    f_body = font(25, "Regular")
    f_small = font(21, "Medium")

    d.text((178, 62), "DİŞ AĞRISI", font=f_h1, fill=TEAL_D)
    d.text((180, 120), "Nedenleri ve evde rahatlama yöntemleri", font=f_sub, fill=MUTED)

    cards = [
        ("Nedenleri", "Çürük, diş eti iltihabı, mine hassasiyeti veya apse kaynaklı olabilir.", TEAL, 236),
        ("Evde rahatlama", "Ilık tuzlu su ile gargara, soğuk kompres ve ağrıyan bölgeye baskı yapmamak.", (14, 110, 172), 432),
        ("Ne zaman hekime?", "Ağrı 2 günden uzun sürüyor, şişlik veya ateş varsa vakit kaybetmeden gelin.", (11, 122, 106), 628),
    ]

    for title, text, color, y in cards:
        d.rounded_rectangle([72, y, W - 72, y + 168], radius=22, fill=(255, 255, 255),
                            outline=(220, 238, 245), width=2)
        d.rounded_rectangle([72, y, 84, y + 168], radius=6, fill=color)
        d.text((112, y + 26), title.upper(), font=f_head, fill=color)
        ty = y + 74
        for line in wrap(d, text, f_body, W - 72 - 150):
            d.text((112, ty), line, font=f_body, fill=(45, 74, 66))
            ty += 34

    # alt bilgi kutusu
    y0 = 862
    d.rounded_rectangle([72, y0, W - 72, y0 + 148], radius=22, fill=TEAL_D)
    d.text((112, y0 + 26), "DİNÇ DİŞ KLİNİĞİ", font=font(30, "ExtraBold"), fill=(255, 255, 255))
    d.text((112, y0 + 72), "0536 597 35 95 · Tepebağ Mah. Nalbant Halil Sok. No:21", font=f_small, fill=(170, 232, 245))
    d.text((112, y0 + 104), "Seyhan / Adana · Hafta içi 09:00–18:00 · Cumartesi 10:00–19:00", font=f_small, fill=(170, 232, 245))

    d.text((72, 1046), "Bu bilgiler genel bilgilendirme amaçlıdır, hekim muayenesinin yerini tutmaz.", font=font(19, "Regular"), fill=MUTED)
    d.text((72, 1100), "dinç diş kliniği", font=font(20, "SemiBold"), fill=(199, 224, 234))

    out = os.path.join(ROOT, "info-toothache.jpg")
    img.save(out, quality=92, optimize=True, progressive=True)
    print("✅", out)


if __name__ == "__main__":
    main()
