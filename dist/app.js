(() => {
  "use strict";
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const splash = document.querySelector("#site-splash");

  function finishIntro() {
    window.clearTimeout(window.CAMPUS_INTRO_FAILSAFE);
    root.classList.remove("intro-pending");
    root.classList.add("intro-finished");
    if (splash) window.setTimeout(() => { splash.hidden = true; }, reducedMotion.matches ? 0 : 450);
  }

  if (root.classList.contains("intro-pending") && !reducedMotion.matches && splash) {
    splash.hidden = false;
    const elapsed = performance.now() - (window.CAMPUS_INTRO_STARTED || 0);
    window.setTimeout(finishIntro, Math.max(0, 1150 - elapsed));
  } else {
    finishIntro();
  }

  const track = document.querySelector("#download-track");
  if (track && track.children.length > 1) {
    const gallery = track.closest(".download-gallery");
    const arrows = gallery.querySelector("[data-gallery-arrows]");
    const controls = gallery.querySelector("[data-gallery-controls]");
    const prev = arrows.querySelector("[data-gallery-prev]");
    const next = arrows.querySelector("[data-gallery-next]");
    const toggle = controls.querySelector("[data-gallery-toggle]");
    const count = controls.querySelector("[data-gallery-count]");
    const last = track.children.length - 1;
    const canHover = window.matchMedia("(hover: hover)");
    let index = 0;
    let target = null;
    let frame = 0;
    let timer = 0;
    let visible = !("IntersectionObserver" in window);
    let playing = !reducedMotion.matches;

    function scheduleGallery() {
      window.clearTimeout(timer);
      const paused = !playing || !visible || document.hidden ||
        (canHover.matches && gallery.matches(":hover")) ||
        document.activeElement === track || gallery.querySelector(":focus-visible");
      count.setAttribute("aria-live", paused ? "polite" : "off");
      if (!paused) timer = window.setTimeout(() => chooseSlide(index === last ? 0 : index + 1, index === last), 5000);
    }

    function syncGallery() {
      frame = 0;
      if (!track.clientWidth) return;
      index = Math.min(last, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
      if (target === index) target = null;
      prev.disabled = index === 0;
      next.disabled = index === last;
      const text = (index + 1) + " / " + (last + 1);
      if (count.textContent !== text) count.textContent = text;
    }

    function chooseSlide(position, wrap = false) {
      target = Math.min(last, Math.max(0, position));
      track.scrollTo({ left: target * track.clientWidth, behavior: wrap || reducedMotion.matches ? "instant" : "smooth" });
      scheduleGallery();
    }

    function setPlaying(value) {
      playing = value;
      toggle.textContent = playing ? "Jeda galeri" : "Putar galeri";
      scheduleGallery();
    }

    prev.addEventListener("click", () => chooseSlide((target ?? index) - 1));
    next.addEventListener("click", () => chooseSlide((target ?? index) + 1));
    toggle.addEventListener("click", () => setPlaying(!playing));
    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      chooseSlide((target ?? index) + (event.key === "ArrowLeft" ? -1 : 1));
    });
    track.addEventListener("scroll", () => {
      if (!frame) frame = requestAnimationFrame(syncGallery);
      scheduleGallery();
    }, { passive: true });
    for (const event of ["pointerdown", "wheel"]) {
      track.addEventListener(event, () => { target = null; scheduleGallery(); }, { passive: true });
    }
    for (const event of ["mouseenter", "mouseleave", "focusin", "focusout"]) {
      gallery.addEventListener(event, () => requestAnimationFrame(scheduleGallery));
    }
    document.addEventListener("visibilitychange", scheduleGallery);
    window.addEventListener("resize", () => { target = null; syncGallery(); scheduleGallery(); });
    reducedMotion.addEventListener("change", () => setPlaying(!reducedMotion.matches));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.intersectionRatio >= .35;
        scheduleGallery();
      }, { threshold: .35 }).observe(gallery);
    }
    arrows.hidden = controls.hidden = false;
    syncGallery();
    setPlaying(playing);
  }

  const copyChecksum = document.querySelector("[data-copy-checksum]");
  if (copyChecksum && navigator.clipboard?.writeText) {
    copyChecksum.hidden = false;
    copyChecksum.addEventListener("click", async () => {
      const checksum = document.querySelector("[data-checksum]");
      const feedback = document.querySelector("[data-checksum-feedback]");
      try {
        await navigator.clipboard.writeText(checksum.textContent.trim());
        feedback.textContent = "SHA-256 disalin.";
      } catch {
        feedback.textContent = "Pilih dan salin kode di atas.";
      }
    });
  }

  const motionToggle = document.querySelector(".ambient-toggle");
  motionToggle?.addEventListener("click", () => {
    const paused = root.classList.toggle("ambient-paused");
    motionToggle.setAttribute("aria-pressed", String(paused));
    motionToggle.textContent = paused ? "Lanjutkan animasi" : "Jeda animasi";
  });

  const links = window.CAMPUS_LINKS || {};
  const dialog = document.querySelector("#availability-dialog");
  const title = document.querySelector("#dialog-title");
  const description = document.querySelector("#dialog-description");
  const messages = {
    apk: {
      title: "Unduhan belum tersedia.",
      description: "Berkas Android belum tersedia pada tautan ini. Silakan periksa kembali kemudian."
    },
    story: {
      title: "Cerita Arthur segera hadir.",
      description: "Cerita lengkap Arthur sedang disiapkan. Tautan akan tersedia setelah cerita dipublikasikan."
    }
  };

  function getPublicLink(value) {
    if (typeof value !== "string" || !value.trim() || value.length > 2048 || /[\u0000-\u001f\u007f]/.test(value)) return null;
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  }

  document.querySelectorAll("[data-access]").forEach((anchor) => {
    const kind = anchor.dataset.access;
    const destination = getPublicLink(links[kind]);
    if (destination) {
      anchor.href = destination;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.setAttribute("aria-label", `${anchor.textContent.trim()} (dibuka di tab baru)`);
    } else {
      anchor.setAttribute("aria-haspopup", "dialog");
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        const message = messages[kind];
        if (!message || !dialog) return;
        title.textContent = message.title;
        description.textContent = message.description;
        if (!dialog.open) dialog.showModal();
      });
    }
  });

  dialog?.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) {
      dialog.close();
    }
  });

  // Konten tetap terlihat jika animasi dinonaktifkan atau browser tidak mendukung observer.
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const items = document.querySelectorAll("[data-reveal]");
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
      items.forEach((item) => {
        observer.observe(item);
        item.addEventListener("focusin", () => {
          item.classList.add("is-visible");
          observer.unobserve(item);
        });
      });
      root.classList.add("motion-enabled");
    } catch {
      root.classList.remove("motion-enabled");
    }
  }

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("motion-paused", document.hidden);
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      finishIntro();
      root.classList.remove("motion-enabled");
    }
  });
})();
