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
