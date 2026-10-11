(() => {
  "use strict";
  const links = window.CAMPUS_LINKS || {};
  const dialog = document.querySelector("#availability-dialog");
  const title = document.querySelector("#dialog-title");
  const description = document.querySelector("#dialog-description");
  const messages = {
    apk: {
      title: "Perjalanannya sedang disiapkan.",
      description: "Versi Android belum tersedia untuk diunduh. Kunjungi halaman ini lagi saat game dirilis."
    },
    story: {
      title: "Cerita Arthur segera hadir.",
      description: "Cerita lengkap Arthur sedang disiapkan. Nanti kamu bisa membacanya melalui tombol ini."
    }
  };

  function getPublicLink(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" ? url.href : null;
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
    document.querySelector("[data-release-status]").textContent = "Versi Android tersedia · Unduh APK";
    document.querySelector("[data-access-description]").textContent = "Unduh versi Android dan mulai perjalanan Arthur.";
  }

  dialog?.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) {
      dialog.close();
    }
  });
})();
