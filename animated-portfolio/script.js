/* Animated portfolio — vanilla JS, no dependencies */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- Footer year + New York clock ---------- */
  $("#year").textContent = new Date().getFullYear();
  const clock = $("#clock");
  const tickClock = () => {
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
    });
    clock.textContent = `New York · ${time}`;
  };
  tickClock();
  setInterval(tickClock, 15000);

  /* ---------- Text splitting ---------- */
  // Split each word into letters (for the staggered "rise" animation).
  function splitChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    let index = 0;
    el.textContent = "";
    words.forEach((word, wi) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "char";
        c.style.setProperty("--i", index++);
        c.textContent = ch;
        wordEl.appendChild(c);
      }
      el.appendChild(wordEl);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  // Wrap each word (for the scroll-driven word highlight).
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    return $$(".w", el);
  }

  $$("[data-split]").forEach(splitChars);
  const aboutWords = splitWords($("#aboutText"));

  /* ---------- Loader + hero intro ---------- */
  const loader = $("#loader");
  const loaderNum = $("#loaderNum");
  const loaderBar = $("#loaderBar");

  const startHero = () => {
    $$(".hero [data-split]").forEach((el) => el.classList.add("is-in"));
  };

  if (reduce) {
    loader.remove();
    document.body.classList.remove("is-loading");
    startHero();
  } else {
    const duration = 1600;
    const t0 = performance.now();
    const finish = () => {
      loader.classList.add("done");
      document.body.classList.remove("is-loading");
      startHero();
      setTimeout(() => loader.remove(), 1200);
    };
    const step = (now) => {
      const p = clamp((now - t0) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      loaderNum.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      loaderBar.style.width = `${eased * 100}%`;
      if (p < 1) requestAnimationFrame(step);
      else finish();
    };
    requestAnimationFrame(step);
  }

  /* ---------- Rotating role text (typewriter) ---------- */
  const roles = ["UI/UX Designer", "Brand Builder", "Motion Artist", "Web Creator"];
  const roleEl = $("#roleText");
  if (!reduce) {
    let ri = 0;
    let ci = 0;
    let deleting = false;
    const typeLoop = () => {
      const word = roles[ri];
      if (!deleting) {
        ci += 1;
        roleEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          return setTimeout(typeLoop, 1600);
        }
        return setTimeout(typeLoop, 90);
      }
      ci -= 1;
      roleEl.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        return setTimeout(typeLoop, 300);
      }
      return setTimeout(typeLoop, 40);
    };
    setTimeout(() => {
      roleEl.textContent = "";
      typeLoop();
    }, 2200);
  }

  /* ---------- Count-up numbers ---------- */
  const counters = $$("[data-count]");
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const t0 = performance.now();
    const step = (now) => {
      const p = clamp((now - t0) / duration, 0, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduce) counters.forEach((el) => (el.textContent = "0"));

  /* ---------- Scroll reveal ---------- */
  // Stagger siblings slightly so grids cascade in.
  $$("[data-reveal]").forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
    const i = siblings.indexOf(el);
    el.style.setProperty("--d", `${(i % 3) * 120}ms`);
  });

  const revealTargets = $$("[data-reveal], [data-split], [data-count]").filter(
    (el) => !el.closest(".hero")
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-count")) countUp(el);
        if (el.hasAttribute("data-reveal")) {
          // Clear the stagger delay after the entrance so hovers feel instant.
          setTimeout(() => {
            el.style.transitionDelay = "0ms";
          }, 1400);
        }
        io.unobserve(el);
      });
    },
    { threshold: 0.2 }
  );

  if (reduce) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
    counters.forEach((el) => (el.textContent = el.dataset.count));
  } else {
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ---------- Nav + scroll-driven effects ---------- */
  const nav = $("#nav");
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;

    nav.classList.toggle("scrolled", y > 40);

    // Hide nav on scroll down, show on scroll up.
    const dy = y - lastY;
    if (y > 300 && dy > 6) nav.classList.add("hide");
    else if (dy < -6) nav.classList.remove("hide");
    lastY = y;

    // Word-by-word highlight for the about paragraph.
    if (aboutWords.length) {
      const about = $("#about");
      const r = about.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1);
      const n = aboutWords.length;
      aboutWords.forEach((w, i) => w.classList.toggle("lit", p >= i / n));
    }
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Desktop-only enhancements ---------- */
  if (fine && !reduce) {
    /* Custom cursor: dot follows exactly, ring eases behind */
    const cur = $(".cursor");
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });

    (function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    window.addEventListener("pointerdown", () => cur.classList.add("is-down"));
    window.addEventListener("pointerup", () => cur.classList.remove("is-down"));
    const hoverSel = "a, button, [data-hover]";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(hoverSel)) cur.classList.add("is-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hoverSel)) cur.classList.remove("is-hover");
    });
    // Hide the cursor when the pointer leaves the window.
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) cur.style.opacity = "0";
    });
    document.addEventListener("mouseover", () => (cur.style.opacity = "1"));

    /* Magnetic buttons */
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });

    /* Project cards: 3D tilt + spotlight */
    $$(".project").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        card.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });

    /* Hero blobs drift with the mouse */
    const blobs = $$(".blob");
    window.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      blobs.forEach((b) => {
        const k = Number(b.dataset.k) || 1;
        b.style.transform = `translate3d(${nx * k * 80}px, ${ny * k * 80}px, 0)`;
      });
    });
  }

  /* ---------- Project filters ---------- */
  const filters = $$(".filter");
  const projects = $$(".project");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => b.classList.toggle("is-active", b === btn));
      projects.forEach((p) => {
        const show = f === "all" || p.dataset.cat === f;
        p.classList.toggle("hidden", !show);
        if (show) {
          p.classList.remove("pop");
          void p.offsetWidth; // restart the animation
          p.classList.add("pop");
        }
      });
    });
  });
})();
