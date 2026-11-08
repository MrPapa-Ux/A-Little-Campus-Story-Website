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

  if (getPublicLink(links.apk)) {
    document.querySelector("[data-release-status]").textContent = "Demo Android tersedia · Berkas APK di Google Drive";
    document.querySelector("[data-access-description]").textContent = "Tombol unduh membuka folder Google Drive yang berisi berkas permainan.";
  }

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
