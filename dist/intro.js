"use strict";
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("intro-pending");
        window.CAMPUS_INTRO_STARTED = performance.now();
        window.CAMPUS_INTRO_FAILSAFE = window.setTimeout(() => {
          document.documentElement.classList.remove("intro-pending");
          document.documentElement.classList.add("intro-finished");
        }, 2600);
      }
