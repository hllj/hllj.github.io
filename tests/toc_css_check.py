#!/usr/bin/env python3
"""Check TOC button/panel CSS in _site/assets/css/main.css (run build first)."""
import re, sys
css = open("_site/assets/css/main.css").read()
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
rules = []
def walk(t):
    i = 0
    while i < len(t):
        j = t.find("{", i)
        if j < 0: break
        sel = t[i:j].strip(); d = 1; k = j + 1
        while d and k < len(t):
            d += (t[k] == "{") - (t[k] == "}"); k += 1
        body = t[j+1:k-1]
        if sel.startswith("@"): walk(body)
        else: rules.append((sel, body))
        i = k
walk(css)
errs = []
def decls(b): return dict((a.strip(), v.strip()) for a, v in re.findall(r"([\w-]+)\s*:\s*([^;]+)", b))
chrome = re.compile(r"(nav\.toc|\.toc(?![\w-])|\.toc--js(?![\w-])|\.sidebar__right\.sticky)(?![^\s,>+~]*__)")
menu_open = []
final = {}
for sel, body in rules:
    d = decls(body)
    for s in [x.strip() for x in sel.split(",")]:
        last = re.split(r"[\s>+~]+", s)[-1]
        if "toc__menu" in s or ".nav__title" in s or " a" == s[-2:] or "header" in last:
            if "toc__menu" in s and "is-open" in s: menu_open.append((s, d))
            continue
        if not chrome.search(last) or "is-open" in last: continue
        if re.search(r"\.toc[^\s,]*\s+\S", s) and not s.endswith(last): pass
        for k, v in d.items(): final["background" if k == "background-color" else k] = (s, v)

for k, (s_, v) in final.items():
    if k.startswith("border") and k not in ("border-radius",) and "color" not in k and "style" not in k:
        if not re.fullmatch(r"(none|0|0px)(\s+(none|0|0px))*", v): errs.append(f"border on {s_}: {k}:{v}")
    if k == "box-shadow" and v != "none": errs.append(f"shadow on {s_}")
    if k in ("background", "background-color") and not re.fullmatch(r"(none|transparent|rgba\(0,\s*0,\s*0,\s*0\))", v): errs.append(f"bg on {s_}: {v}")
    if k == "border-radius" and v not in ("0", "0px"): errs.append(f"radius on {s_}: {v}")
for sel, body in rules:
    if "toc__menu" in sel and ("left:calc(100%" in body.replace(" ", "") or "left:100%" in body.replace(" ", "")): errs.append(f"side-by-side menu: {sel}")
merged = {}
for s, d in menu_open: merged.update(d)
if merged.get("overflow-y") != "auto": errs.append("open menu lacks overflow-y:auto")
mh = merged.get("max-height", "")
m = re.findall(r"(\d+)vh", mh)
if not m or not all(50 <= int(x) <= 75 for x in m[:1]): errs.append(f"max-height bad: {mh}")
if merged.get("overflow") == "visible" or mh == "none": errs.append("overflow visible/max-height none")
if merged.get("top") != "100%" or merged.get("left") != "0": errs.append(f"menu pos {merged.get('top')}/{merged.get('left')}")
if not re.search(r"background(-color)?:\s*(#fff|#ffffff)", " ".join(b for s, b in rules if "is-open" in s and "toc__menu" in s)): errs.append("no light opaque menu bg")
if not any("is-open" in s and "toc__menu" in s and "#161b22" in b for s, b in rules): errs.append("no dark opaque menu bg")
if not any("nav__title" in s and "#1a4f9c" in b for s, b in rules) and not any("nav__title" in s and "background" in b for s, b in rules): errs.append("blue header bg missing")
if errs: print("\n".join(errs)); sys.exit(1)
print("toc css ok")
