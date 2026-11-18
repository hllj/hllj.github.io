/* Post UX enhancements */
(function () {
  "use strict";
  document.documentElement.setAttribute("data-post-ux", "1");

  // Reading progress bar (only present on post pages)
  var wrap = document.getElementById("reading-progress");
  if (wrap) {
    var bar = wrap.querySelector(".reading-progress__bar");
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var y = window.pageYOffset || doc.scrollTop || 0;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
      wrap.setAttribute("aria-valuenow", Math.round(p * 100));
    };
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; update(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }
})();

// TOC scroll-spy: highlight the entry for the section currently in view
(function () {
  "use strict";
  var links = document.querySelectorAll(".toc .toc__menu a[href^='#']");
  if (!links.length) return;
  var items = [];
  Array.prototype.forEach.call(links, function (a) {
    var id = decodeURIComponent(a.getAttribute("href").slice(1));
    var el = document.getElementById(id);
    if (el) items.push({ a: a, el: el });
  });
  if (!items.length) return;
  var current = null;
  var update = function () {
    var offset = 120, active = items[0];
    for (var i = 0; i < items.length; i++) {
      if (items[i].el.getBoundingClientRect().top - offset <= 0) active = items[i]; else break;
    }
    var doc = document.documentElement;
    if (window.innerHeight + (window.pageYOffset || doc.scrollTop) >= doc.scrollHeight - 2) active = items[items.length - 1];
    if (active === current) return;
    if (current) { current.a.classList.remove("is-active"); current.a.removeAttribute("aria-current"); }
    active.a.classList.add("is-active");
    active.a.setAttribute("aria-current", "true");
    current = active;
  };
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

// Mobile TOC: collapsible block (collapsed by default below 1024px; CSS only applies the collapse there)
(function () {
  "use strict";
  var toc = document.querySelector(".page__content .toc");
  if (!toc) return;
  var title = toc.querySelector(".nav__title");
  var menu = toc.querySelector(".toc__menu");
  if (!title || !menu) return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "toc__toggle";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", "Toggle table of contents");
  btn.innerHTML = '<span class="toc__chevron" aria-hidden="true"></span>';
  title.appendChild(btn);
  toc.classList.add("toc--js");
  var set = function (open) {
    toc.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };
  title.addEventListener("click", function () { set(!toc.classList.contains("is-open")); });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a") && window.matchMedia("(max-width: 1023px)").matches) set(false);
  });
})();

// Heading anchors: the theme script also injects "#" links at runtime; keep only the server-rendered one.
(function () {
  "use strict";
  var run = function () {
    document.querySelectorAll(".page__content .header-link").forEach(function (a) {
      if (a.hasAttribute("aria-label")) return;
      if (a.parentElement.querySelector(".header-link[aria-label]")) a.remove();
    });
  };
  run();
  window.addEventListener("load", run);
  setTimeout(run, 300);
})();

// Heading anchors: the theme script also injects "#" links at runtime; keep only the server-rendered one.
(function () {
  "use strict";
  var run = function () {
    document.querySelectorAll(".page__content .header-link").forEach(function (a) {
      if (a.hasAttribute("aria-label")) return;
      if (a.parentElement.querySelector(".header-link[aria-label]")) a.remove();
    });
  };
  run();
  window.addEventListener("load", run);
  setTimeout(run, 300);
})();

// Copy button on every code block, with "Copied" feedback for ~2s
(function () {
  "use strict";
  var fallback = function (text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  };
  var copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallback(text); });
    }
    return fallback(text);
  };
  document.querySelectorAll(".page__content div.highlighter-rouge").forEach(function (block) {
    var code = block.querySelector("pre code") || block.querySelector("pre");
    if (!code || block.querySelector(".code-copy")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    var timer = null;
    btn.addEventListener("click", function () {
      copy(code.innerText.replace(/\n$/, "")).then(function () {
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
      }, function () {
        btn.textContent = "Failed";
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("is-copied");
        }, 2000);
      });
    });
    block.appendChild(btn);
  });
})();

// Click-to-zoom lightbox for images in post content
(function () {
  "use strict";
  var imgs = document.querySelectorAll(".page__content img");
  if (!imgs.length) return;
  var overlay = null, opener = null;
  var close = function () {
    if (!overlay) return;
    document.removeEventListener("keydown", onKey, true);
    overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.documentElement.classList.remove("lightbox-open");
    if (opener && opener.focus) opener.focus();
    opener = null;
  };
  var onKey = function (e) {
    if (e.key === "Escape" || e.key === "Esc") { e.preventDefault(); close(); }
    else if (e.key === "Tab") { e.preventDefault(); }
  };
  var open = function (img) {
    if (overlay) return;
    opener = img;
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", img.alt || "Image preview");
    overlay.tabIndex = -1;
    var big = document.createElement("img");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || "";
    overlay.appendChild(big);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lightbox__close";
    btn.setAttribute("aria-label", "Close image");
    btn.textContent = "×";
    overlay.appendChild(btn);
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    document.documentElement.classList.add("lightbox-open");
    document.addEventListener("keydown", onKey, true);
    btn.focus();
  };
  Array.prototype.forEach.call(imgs, function (img) {
    if (img.closest("a") || img.closest(".page__related, .archive")) return;
    img.classList.add("lightbox-trigger");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.addEventListener("click", function () { open(img); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); }
    });
  });
})();

// Images: lazy-load, alt fallback, and reserve space (width/height) to avoid layout shift
(function () {
  "use strict";
  var imgs = document.querySelectorAll(".page__content img");
  Array.prototype.forEach.call(imgs, function (img) {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    if (!img.hasAttribute("alt")) img.setAttribute("alt", "");
    var reserve = function () {
      if (img.naturalWidth && !img.getAttribute("width") && !img.getAttribute("height")) {
        img.setAttribute("width", img.naturalWidth);
        img.setAttribute("height", img.naturalHeight);
      }
    };
    if (img.complete) reserve(); else img.addEventListener("load", reserve, { once: true });
  });
})();

// Tables: wrap in a horizontally scrollable container
(function () {
  "use strict";
  document.querySelectorAll(".page__content table").forEach(function (t) {
    if (t.parentNode && t.parentNode.classList.contains("table-wrap")) return;
    var w = document.createElement("div");
    w.className = "table-wrap";
    w.setAttribute("tabindex", "0");
    w.setAttribute("role", "region");
    w.setAttribute("aria-label", "Scrollable table");
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
})();

// Back-to-top floating button: appears after ~600px of scrolling
(function () {
  "use strict";
  var btn = document.querySelector(".back-to-top");
  if (!btn) return;
  var visible = false;
  var update = function () {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var show = y > 600;
    if (show === visible) return;
    visible = show;
    btn.classList.toggle("is-visible", show);
    if (show) btn.removeAttribute("hidden"); else btn.setAttribute("hidden", "");
  };
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  btn.addEventListener("click", function () {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var h = document.querySelector(".page__title, h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  });
  update();
})();

// Masthead auto-hide: slides away on scroll down, returns on scroll up (post pages only)
(function () {
  "use strict";
  var mast = document.querySelector(".masthead");
  if (!mast || !document.getElementById("reading-progress")) return;
  var root = document.documentElement;
  root.classList.add("masthead-autohide");
  var last = window.pageYOffset || 0, ticking = false;
  var update = function () {
    ticking = false;
    var y = Math.max(0, window.pageYOffset || root.scrollTop || 0);
    var dy = y - last;
    var h = mast.offsetHeight || 60;
    if (y <= h || dy < -4) {
      mast.classList.remove("is-hidden");
    } else if (dy > 4 && !mast.contains(document.activeElement)) {
      mast.classList.add("is-hidden");
    }
    if (Math.abs(dy) > 4 || y <= h) last = y;
  };
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  // keyboard focus inside the masthead always reveals it
  mast.addEventListener("focusin", function () { mast.classList.remove("is-hidden"); });
})();
