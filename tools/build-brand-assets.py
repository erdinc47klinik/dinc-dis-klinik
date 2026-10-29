#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dinç Diş Kliniği — marka görselleri üreticisi
Tek kaynaktan: menü/hizmet ikonları, PWA ikonları, logo kilidi ve OG görseli.
Çalıştırma:  python3 tools/build-brand-assets.py
"""
import os
import re
import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LUCIDE = "/tmp/lucide/package/icons"
FONT_DIR = "/home/user/.fonts"
OUT_SRC = os.path.join(ROOT, "assets", "icons-src")
os.makedirs(OUT_SRC, exist_ok=True)

TEAL = "#0B6E86"
TEAL_D = "#07566A"
TEAL_L = "#0E93AC"
MUTED = "#5C93A3"


# ---------------------------------------------------------------- lucide
def lucide(name: str) -> str:
    raw = open(os.path.join(LUCIDE, name + ".svg"), encoding="utf-8").read()
    raw = re.sub(r"<!--.*?-->", "", raw, flags=re.S)
    raw = raw[raw.index("<svg"):]
    inner = raw[raw.index(">") + 1: raw.rindex("</svg>")]
    return inner.replace('stroke="currentColor"', "").strip()


# --------------------------------------------------------- dental glyphs
TOOTH = ("M12 3.2c-1.9 0-3.2-.9-5-.9C4.5 2.3 3 4.1 3 6.9c0 2.2.9 3.8 1.5 5.3"
         ".6 1.4.9 3 1.1 4.7.2 1.5.5 3.3 1.6 3.3 1.2 0 1.4-1.6 1.7-3.3"
         ".3-1.6.6-2.8 2.1-2.8s1.8 1.2 2.1 2.8c.3 1.7.5 3.3 1.7 3.3"
         "1.1 0 1.4-1.8 1.6-3.3.2-1.7.5-3.3 1.1-4.7C18.1 10.7 19 9.1 19 6.9"
         "c0-2.8-1.5-4.6-4-4.6-1.8 0-3.1.9-5 .9z")

# diş glifinin sınır kutusu (ölçekleme/ortalama için)
TOOTH_BBOX = (3.0, 2.3, 19.0, 19.3)
TOOTH_CX = (TOOTH_BBOX[0] + TOOTH_BBOX[2]) / 2
TOOTH_CY = (TOOTH_BBOX[1] + TOOTH_BBOX[3]) / 2

G = {}


def glyph(name, body):
    G[name] = body


# --- hizmetler -------------------------------------------------------------
glyph("muayene", lucide("stethoscope"))
glyph("temizlik", lucide("brush"))
glyph("dolgu", f'<path d="{TOOTH}"/><circle cx="12" cy="9.6" r="2.4" fill="#CFEDF7" fill-opacity="0.95"/>')
glyph("kanal", f'<path d="{TOOTH}"/><path d="M12 6.9v7.2"/><circle cx="12" cy="9.2" r="1.1" fill="#CFEDF7"/>')
glyph("cekim", f'<path d="{TOOTH}"/><path d="M17.7 12.9v5.9"/><path d="M15.5 16.6l2.2 2.2 2.2-2.2"/>')
glyph("beyazlatma", lucide("sparkles"))
glyph("implant",
      '<path d="M8.6 3.5h6.8l1.2 3.3a1 1 0 0 1-.94 1.35H8.34A1 1 0 0 1 7.4 6.8l1.2-3.3z"/>'
      '<path d="M9.4 8.15h5.2l-1.1 11.1a1.5 1.5 0 0 1-3 0L9.4 8.15z"/>'
      '<path d="M9.9 11.4h4.2M10.2 14.6h3.6M10.5 17.8h3"/>')
glyph("zirkonyum", lucide("crown"))
glyph("ortodonti",
      '<path d="M3.6 8.4c1.6 5.2 4.6 8.2 8.4 8.2s6.8-3 8.4-8.2"/>'
      '<rect x="6.1" y="10.5" width="2.9" height="2.9" rx="0.85" fill="#CFEDF7"/>'
      '<rect x="10.55" y="11.9" width="2.9" height="2.9" rx="0.85" fill="#CFEDF7"/>'
      '<rect x="15" y="10.5" width="2.9" height="2.9" rx="0.85" fill="#CFEDF7"/>')
glyph("seffafplak", lucide("layers"))
glyph("kopru",
      '<path d="M2.6 9.1h18.8"/>'
      '<path d="M4.9 9.1v9.7M19.1 9.1v9.7"/>'
      '<path d="M4.9 18.8c0-4.4 3.2-7.1 7.1-7.1s7.1 2.7 7.1 7.1"/>'
      '<path d="M2.8 18.8h18.4"/>')

# --- cihazlar --------------------------------------------------------------
glyph("cbct", lucide("scan"))
glyph("scanner", lucide("scan-line"))
glyph("printer3d", lucide("printer"))
glyph("panoramic", lucide("monitor"))
glyph("scaler", lucide("audio-waveform"))
glyph("ledwhite", lucide("sun-medium"))

# --- menü / sekme ----------------------------------------------------------
glyph("account", lucide("user-round"))
glyph("doctors", lucide("users-round"))
glyph("devices", lucide("cpu"))
glyph("smile", lucide("smile"))
glyph("reviews", lucide("star"))
glyph("store", lucide("shopping-bag"))
glyph("address", lucide("map-pin"))
glyph("contact", lucide("phone"))
glyph("info", lucide("book-open"))
glyph("admin", lucide("shield-check"))
glyph("settings", lucide("settings"))
glyph("home", lucide("house"))
glyph("services", lucide("layout-grid"))
glyph("booking", lucide("calendar-check"))
glyph("quickbook", lucide("calendar-plus"))
glyph("chatbot", lucide("bot"))
glyph("more", lucide("ellipsis"))
glyph("dentist-game", lucide("gamepad-2"))


# --------------------------------------------------------------- renderers
def tile_svg(name: str) -> str:
    body = G[name]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <defs>
    <linearGradient id="tilebg" x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#F7FDFF"/><stop offset="1" stop-color="#D3EDF8"/>
    </linearGradient>
    <linearGradient id="tilegl" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="{TEAL_L}"/><stop offset="1" stop-color="{TEAL}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="13" fill="url(#tilebg)"/>
  <rect x="0.65" y="0.65" width="46.7" height="46.7" rx="12.5" fill="none"
        stroke="{TEAL}" stroke-opacity="0.13" stroke-width="1.3"/>
  <g transform="translate(24 24) scale(1.16) translate(-12 -12)" fill="none"
     stroke="url(#tilegl)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    {body}
  </g>
</svg>'''


def plain_svg(name: str, color=TEAL, sw=1.85) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <g fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">
    {G[name]}
  </g>
</svg>'''


def app_icon_svg(maskable=False, size=512) -> str:
    """maskable=True → tam zemin (güvenli alan), False → yuvarlatılmış kare."""
    ratio = 0.47 if maskable else 0.55          # dişin kare içindeki oranı
    k = (size * ratio) / (TOOTH_BBOX[2] - TOOTH_BBOX[0])
    tx = size / 2 - TOOTH_CX * k
    ty = size / 2 - TOOTH_CY * k
    r = 0 if maskable else int(size * 0.226)
    # parıltı: dişin sağ üstünde (küçük, denge unsuru)
    sx = size / 2 + k * 5.9
    sy = size / 2 - k * 6.9
    ss = size * 0.0090
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <defs>
    <linearGradient id="bg" x1="0.05" y1="0" x2="0.95" y2="1">
      <stop offset="0" stop-color="#14A6C2"/><stop offset="0.5" stop-color="{TEAL}"/><stop offset="1" stop-color="{TEAL_D}"/>
    </linearGradient>
    <radialGradient id="sh" cx="0.26" cy="0.12" r="0.85">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.30"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#E4F8FE"/>
    </linearGradient>
  </defs>
  <rect width="{size}" height="{size}" rx="{r}" fill="url(#bg)"/>
  <rect width="{size}" height="{size}" rx="{r}" fill="url(#sh)"/>
  <g transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})">
    <path d="{TOOTH}" fill="url(#ink)"/>
  </g>
  <g transform="translate({sx:.1f} {sy:.1f}) scale({ss:.3f}) translate(-12 -12)" fill="#A8ECFF">
    <path d="M12 2.4l1.9 5.7 5.7 1.9-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.9L12 2.4z"/>
  </g>
</svg>'''


# -------------------------------------------------------------------- PIL
def font(size, weight="ExtraBold"):
    f = ImageFont.truetype(os.path.join(FONT_DIR, "Manrope.ttf"), size)
    f.set_variation_by_name(weight)
    return f


def draw_tracked(draw, xy, text, fnt, fill, tracking=0):
    """Harf aralıklı metin çizimi. Dönen değer: (genişlik, yükseklik)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += fnt.getlength(ch) + tracking
    box = fnt.getbbox(text)
    return x - xy[0] - (tracking if text else 0), box[3] - box[1]


def text_w(text, fnt, tracking=0):
    return sum(fnt.getlength(c) for c in text) + tracking * max(0, len(text) - 1)


def tooth_mark(color, px):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
           f'<path d="{TOOTH}" fill="{color}"/></svg>')
    out = f"/tmp/tooth_{px}_{color.strip('#')}.png"
    cairosvg.svg2png(bytestring=svg.encode(), write_to=out, output_width=px, output_height=px)
    return Image.open(out).convert("RGBA")


def rounded_mark(px, radius_ratio=0.226):
    """Turkuaz yuvarlak-kare üzerinde beyaz diş (küçük logo işareti)."""
    s = px
    svg = app_icon_svg(False, 512)
    cairosvg.svg2png(bytestring=svg.encode(), write_to="/tmp/mark.png", output_width=s, output_height=s)
    return Image.open("/tmp/mark.png").convert("RGBA")


def build_lockup(path):
    W, H = 1200, 420
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mark = rounded_mark(210)
    img.alpha_composite(mark, (54, (H - 210) // 2))

    d = ImageDraw.Draw(img)
    f1, f2, f3 = font(104, "ExtraBold"), font(42, "SemiBold"), font(25, "Medium")
    x = 320
    top = 88
    d.text((x, top), "DİNÇ DİŞ", font=f1, fill=TEAL_D)
    draw_tracked(d, (x + 4, top + 132), "KLİNİĞİ", f2, TEAL, tracking=13)
    draw_tracked(d, (x + 6, top + 200), "ADANA · SEYHAN", f3, MUTED, tracking=3.4)
    img.save(path)
    return path


def build_og(path):
    W, H = 1200, 630
    base = Image.new("RGB", (W, H), TEAL)
    d = ImageDraw.Draw(base)
    for y in range(H):                                  # dikey degrade
        t = y / H
        r = int(10 + (14 - 10) * t)
        g = int(100 + (147 - 100) * t)
        b = int(120 + (172 - 120) * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    for x in range(W):                                  # yatay ışık
        t = x / W
        if t > 0.35:
            continue
        a = int(28 * (1 - t / 0.35))
        d.line([(x, 0), (x, H)], fill=(10 + a, 100 + a, 120 + a))

    mark = rounded_mark(150)
    glass = Image.new("RGBA", (150, 150), (255, 255, 255, 34))
    base.paste(Image.alpha_composite(glass, mark), (90, 96), None)

    d = ImageDraw.Draw(base)
    f1 = font(86, "ExtraBold")
    f2 = font(34, "Medium")
    f3 = font(29, "SemiBold")
    d.text((92, 288), "DİNÇ DİŞ KLİNİĞİ", font=f1, fill="#FFFFFF")
    d.text((94, 392), "Erdinç KÖLÜK · İmplant & Çene Cerrahisi Uzmanı", font=f2, fill="#CDF3FF")
    d.text((94, 452), "Tepebağ Mah. Nalbant Halil Sok. No:21 · Seyhan / Adana", font=f3, fill="#9FE9FF")
    d.text((94, 500), "0536 597 35 95", font=f3, fill="#FFFFFF")
    base.save(path, optimize=True)
    return path


# -------------------------------------------------------------------- save
def png(svg_text, path, width, height=None):
    cairosvg.svg2png(bytestring=svg_text.encode("utf-8"), write_to=path,
                     output_width=width, output_height=height or width)


def save_svg(svg_text, path):
    open(path, "w", encoding="utf-8").write(svg_text)


ICON_FILES = [
    ("icon-muayene", "muayene"), ("icon-temizlik", "temizlik"), ("icon-dolgu", "dolgu"),
    ("icon-kanal", "kanal"), ("icon-cekim", "cekim"), ("icon-beyazlatma", "beyazlatma"),
    ("icon-implant", "implant"), ("icon-zirkonyum", "zirkonyum"), ("icon-ortodonti", "ortodonti"),
    ("icon-seffafplak", "seffafplak"), ("icon-kopru", "kopru"),
    ("icon-cbct", "cbct"), ("icon-scanner", "scanner"), ("icon-printer3d", "printer3d"),
    ("icon-panoramic", "panoramic"), ("icon-scaler", "scaler"), ("icon-ledwhite", "ledwhite"),
    ("icon-account", "account"), ("icon-doctors", "doctors"), ("icon-devices", "devices"),
    ("icon-smile", "smile"), ("icon-reviews", "reviews"), ("icon-store", "store"),
    ("icon-address", "address"), ("icon-contact", "contact"), ("icon-info", "info"),
    ("icon-admin", "admin"), ("icon-settings", "settings"), ("icon-dentist-game", "dentist-game"),
]

TAB_FILES = [
    ("tab-home", "home"), ("tab-services", "services"), ("tab-booking", "booking"),
    ("tab-quickbook", "quickbook"), ("tab-chatbot", "chatbot"), ("tab-more", "more"),
]


def main():
    # 1) kare ikonlar (256px, retina için fazlasıyla yeterli)
    for fname, gname in ICON_FILES:
        svg = tile_svg(gname)
        save_svg(svg, os.path.join(OUT_SRC, fname + ".svg"))
        png(svg, os.path.join(ROOT, fname + ".png"), 256)

    # 2) sekme ikonları — şeffaf zemin, tek renk
    for fname, gname in TAB_FILES:
        svg = plain_svg(gname)
        save_svg(svg, os.path.join(OUT_SRC, fname + ".svg"))
        png(svg, os.path.join(ROOT, fname + ".png"), 96)

    # 3) uygulama / PWA ikonları
    icon_svg = app_icon_svg(False)
    save_svg(icon_svg, os.path.join(OUT_SRC, "app-icon.svg"))
    for size in (192, 512, 1024):
        png(icon_svg, os.path.join(ROOT, f"icon-{size}.png"), size)

    mask_svg = app_icon_svg(True)
    save_svg(mask_svg, os.path.join(OUT_SRC, "app-icon-maskable.svg"))
    for size in (192, 512):
        png(mask_svg, os.path.join(ROOT, f"icon-maskable-{size}.png"), size)

    png(mask_svg, os.path.join(ROOT, "apple-touch-icon.png"), 180)
    png(icon_svg, os.path.join(ROOT, "favicon-32.png"), 32)
    png(icon_svg, os.path.join(ROOT, "favicon-64.png"), 64)

    # 4) logo kilidi + sosyal medya görseli
    build_lockup(os.path.join(ROOT, "dinc-logo.png"))
    build_og(os.path.join(ROOT, "og-image.png"))

    # 5) önizleme tablosu (kontrol için)
    names = [f for f, _ in ICON_FILES] + ["icon-192"]
    cols, cell = 8, 96
    rows = (len(names) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * cell), "#EAF7FC")
    for i, n in enumerate(names):
        im = Image.open(os.path.join(ROOT, n + ".png")).convert("RGBA").resize((cell - 16, cell - 16), Image.LANCZOS)
        bg = Image.new("RGBA", im.size, (234, 247, 252, 255))
        bg.alpha_composite(im)
        sheet.paste(bg.convert("RGB"), ((i % cols) * cell + 8, (i // cols) * cell + 8))
    sheet.save("/home/user/preview-icons.png")

    tabs = Image.new("RGBA", (len(TAB_FILES) * 72, 72), (255, 255, 255, 255))
    for i, (n, _) in enumerate(TAB_FILES):
        im = Image.open(os.path.join(ROOT, n + ".png")).convert("RGBA").resize((48, 48), Image.LANCZOS)
        tabs.alpha_composite(im, (i * 72 + 12, 12))
    tabs.convert("RGB").save("/home/user/preview-tabs.png")

    print("✅ Tüm marka görselleri üretildi.")


if __name__ == "__main__":
    main()
