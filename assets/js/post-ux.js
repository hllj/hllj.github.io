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
