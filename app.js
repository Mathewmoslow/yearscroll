/* global gsap, ScrollTrigger, Observer, Lenis */
(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger, Observer);

  const sceneLanding = document.getElementById("sceneLanding");
  const sceneTimeline = document.getElementById("sceneTimeline");
  const parallaxStage = document.getElementById("parallaxStage");
  const btnEnter = document.getElementById("btnEnter");

  const cardStack = document.getElementById("cardStack");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");

  const months = [
    {
      month: "JANUARY",
      title: "Copilot",
      body:
        "We shipped faster ways to capture tasks and turn them into a study plan, with cleaner prompts and fewer clicks. The goal was simple, keep students moving, not formatting.",
      cta: "Try now"
    },
    {
      month: "FEBRUARY",
      title: "Translation",
      body:
        "We tightened how content gets reshaped for different contexts, short notes, long notes, study cards, quizzes, and schedules. Same source, different output, less friction.",
      cta: "Try now"
    },
    {
      month: "MARCH",
      title: "Video summary",
      body:
        "We made dense content easier to skim without losing meaning, especially lectures, walkthroughs, and long explainers. The system extracts structure first, then writes.",
      cta: "Try now"
    },
    {
      month: "APRIL",
      title: "Milestone drop",
      body:
        "We refined the surface polish, more consistent UI, sharper hierarchy, better spacing, and interaction timing. Everything got easier to read, faster to trust.",
      cta: "Try now"
    },
    {
      month: "MAY",
      title: "Game Assist",
      body:
        "We tested assistance that stays out of your way, low clutter, strong focus, and quick context that does not yank you into a different workflow.",
      cta: "Try now"
    },
    {
      month: "JUNE",
      title: "Streaming",
      body:
        "We improved media control, floating overlays, quick toggles, and responsiveness. When you learn from video, controls must feel invisible until you need them.",
      cta: "Try now"
    }
  ];

  const state = {
    index: 0,
    isAnimating: false
  };

  let lenis = null;

  function initLenis() {
    try {
      if (typeof Lenis !== "function") {
        return;
      }
      lenis = new Lenis({
        duration: 1.1,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      lenis = null;
    }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  /* --------------------------
     LANDING PARALLAX (cursor)
  --------------------------- */

  function initLandingParallax() {
    const tiles = Array.prototype.slice.call(parallaxStage.querySelectorAll(".tile"));
    const quickX = [];
    const quickY = [];
    const quickRot = [];

    tiles.forEach(function (tile) {
      quickX.push(gsap.quickTo(tile, "x", { duration: 0.65, ease: "power3.out" }));
      quickY.push(gsap.quickTo(tile, "y", { duration: 0.65, ease: "power3.out" }));
      quickRot.push(gsap.quickTo(tile, "rotationZ", { duration: 0.9, ease: "power3.out" }));
    });

    function onMove(ev) {
      const rect = parallaxStage.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;
      const py = (ev.clientY - rect.top) / rect.height;

      const nx = (px - 0.5) * 2;
      const ny = (py - 0.5) * 2;

      tiles.forEach(function (tile, i) {
        const depthAttr = tile.getAttribute("data-depth");
        const depth = depthAttr ? parseFloat(depthAttr) : 0.10;

        const dx = nx * 120 * depth;
        const dy = ny * 90 * depth;
        const rz = nx * 6 * depth;

        quickX[i](dx);
        quickY[i](dy);
        quickRot[i](rz);
      });

      gsap.to(".blobA", { x: nx * -20, y: ny * -18, duration: 0.9, ease: "power2.out" });
      gsap.to(".blobB", { x: nx * 16, y: ny * 14, duration: 0.9, ease: "power2.out" });
      gsap.to(".blobC", { x: nx * -12, y: ny * 20, duration: 0.9, ease: "power2.out" });
    }

    window.addEventListener("mousemove", onMove, { passive: true });

    gsap.to(".markPulse", {
      scale: 1.05,
      opacity: 0.80,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(".tile", {
      y: "+=10",
      duration: 3.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.12
    });
  }

  function transitionToTimeline() {
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" }
    });

    tl.to(".tile", { opacity: 0.0, duration: 0.35, stagger: 0.03 }, 0);
    tl.to(".landingCenter", { scale: 0.98, opacity: 0.0, duration: 0.32 }, 0.05);
    tl.to(sceneLanding, { opacity: 0.0, duration: 0.25 }, 0.25);

    tl.set(sceneLanding, { pointerEvents: "none" });
    tl.set(sceneTimeline, { pointerEvents: "auto" }, 0.35);
    tl.to(sceneTimeline, { opacity: 1.0, y: 0, duration: 0.45 }, 0.35);

    tl.add(function () {
      sceneTimeline.focus();
    }, 0.45);
  }

  /* --------------------------
     TIMELINE STACK (3D cards)
  --------------------------- */

  function makeCard(data, idx) {
    const card = document.createElement("article");
    card.className = "monthCard";
    card.setAttribute("data-idx", String(idx));

    const inner = document.createElement("div");
    inner.className = "cardInner";

    const left = document.createElement("div");
    left.className = "cardLeft";

    const pill = document.createElement("div");
    pill.className = "monthPill";
    pill.textContent = data.month;

    const title = document.createElement("h2");
    title.className = "monthTitle";
    title.textContent = data.title;

    const body = document.createElement("div");
    body.className = "monthBody";
    body.textContent = data.body;

    const ctaRow = document.createElement("div");
    ctaRow.className = "ctaRow";

    const cta = document.createElement("button");
    cta.className = "ghostBtn";
    cta.type = "button";
    cta.textContent = data.cta;

    ctaRow.appendChild(cta);

    left.appendChild(pill);
    left.appendChild(title);
    left.appendChild(body);
    left.appendChild(ctaRow);

    const right = document.createElement("div");
    right.className = "cardRight";

    const frame = document.createElement("div");
    frame.className = "previewFrame";

    const frameHeader = document.createElement("div");
    frameHeader.className = "previewHeader";

    const frameContent = document.createElement("div");
    frameContent.className = "previewContent";

    const art = document.createElement("div");
    art.className = "previewArt";

    frameContent.appendChild(art);
    frame.appendChild(frameHeader);
    frame.appendChild(frameContent);
    right.appendChild(frame);

    inner.appendChild(left);
    inner.appendChild(right);
    card.appendChild(inner);

    return card;
  }

  function renderStack() {
    cardStack.innerHTML = "";

    const cards = months.map(function (m, i) {
      return makeCard(m, i);
    });

    cards.forEach(function (c) {
      cardStack.appendChild(c);
    });

    applyStackTransforms(state.index, true);
    updateProgress();
  }

  function updateProgress() {
    const pct = Math.round(((state.index + 1) / months.length) * 100);
    progressLabel.textContent = "Progress " + String(pct) + "%";
    progressFill.style.width = String(pct) + "%";
  }

  function applyStackTransforms(activeIndex, immediate) {
  const cards = Array.prototype.slice.call(cardStack.querySelectorAll(".monthCard"));

  cards.forEach(function (card, i) {
    const d = i - activeIndex;

    // d = 0 is active card
    // d = 1..3 are upcoming previews
    // d < 0 are previous cards (hide them)
    const upcomingDepth = clamp(d, 0, 4);

    // Visible preview offsets (same axis, but shifted so you can see them)
    const offsetXPerStep = 50;   // how much each next card peeks to the right
    const offsetYPerStep = 35;   // stack downward more visibly

    // Depth/tilt controls
    const zPerStep = 120;        // push back in Z
    const scalePerStep = 0.12;   // shrink more noticeably as it goes back
    const rotXPerStep = 3;       // subtle tilt backward
    const rotYPerStep = -1.5;    // slight yaw

    // Active stays centered, upcoming shift right/down
    const translateX = upcomingDepth * offsetXPerStep;
    const translateY = upcomingDepth * offsetYPerStep;
    const translateZ = -upcomingDepth * zPerStep;

    const rotateX = upcomingDepth * rotXPerStep;
    const rotateY = upcomingDepth * rotYPerStep;
    const scale = 1 - upcomingDepth * scalePerStep;

    // Hide previous cards, show upcoming with fading opacity
    const opacity = d < 0 ? 0 : (d === 0 ? 1 : clamp(1 - (d * 0.15), 0.3, 1.0));

    // Stronger blur for background cards
    const blur = d === 0 ? 0 : clamp(upcomingDepth * 2.5, 0, 8);

    // Ensure active is always on top, then 1,2,3 behind it
    const zIndex = 1000 - upcomingDepth;

    // Also stop rendering stuff far behind
    const isFar = d > 4;
    const finalOpacity = isFar ? 0 : opacity;

    const transformString =
      "translate(-50%, -50%) " +
      "translateX(" + String(translateX) + "px) " +
      "translateY(" + String(translateY) + "px) " +
      "translateZ(" + String(translateZ) + "px) " +
      "rotateX(" + String(rotateX) + "deg) " +
      "rotateY(" + String(rotateY) + "deg) " +
      "scale(" + String(scale) + ")";

    if (immediate) {
      gsap.set(card, {
        zIndex: zIndex,
        opacity: finalOpacity,
        filter: "blur(" + String(blur) + "px)",
        transform: transformString,
        pointerEvents: d === 0 ? "auto" : "none"
      });
    } else {
      gsap.to(card, {
        duration: 0.72,
        ease: "power3.out",
        zIndex: zIndex,
        opacity: finalOpacity,
        filter: "blur(" + String(blur) + "px)",
        transform: transformString,
        pointerEvents: d === 0 ? "auto" : "none"
      });
    }
  });
}

  function goToIndex(nextIndex) {
    if (state.isAnimating) {
      return;
    }
    if (nextIndex < 0 || nextIndex >= months.length) {
      return;
    }

    state.isAnimating = true;

    const prev = state.index;
    state.index = nextIndex;

    const direction = state.index > prev ? 1 : -1;

    const activeCard = cardStack.querySelector('.monthCard[data-idx="' + String(prev) + '"]');
    const incomingCard = cardStack.querySelector('.monthCard[data-idx="' + String(state.index) + '"]');

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () {
        state.isAnimating = false;
      }
    });

    if (activeCard) {
      tl.to(activeCard, {
        duration: 0.40,
        opacity: 0.0,
        filter: "blur(10px)"
      }, 0);
    }

    applyStackTransforms(state.index, false);

    if (incomingCard) {
      tl.fromTo(incomingCard,
        {
          opacity: 0.0,
          filter: "blur(12px)"
        },
        {
          duration: 0.55,
          opacity: 1.0,
          filter: "blur(0px)"
        },
        0.10
      );
    }

    tl.to(".stackWash", {
      duration: 0.65,
      opacity: 0.92,
      x: direction * -10,
      y: direction * 8
    }, 0);

    tl.to(".stackWash", {
      duration: 0.75,
      opacity: 0.85,
      x: 0,
      y: 0
    }, 0.45);

    updateProgress();
  }

  function next() {
    goToIndex(state.index + 1);
  }

  function prev() {
    goToIndex(state.index - 1);
  }

  function initTimelineControls() {
    btnNext.addEventListener("click", function () {
      next();
    });

    btnPrev.addEventListener("click", function () {
      prev();
    });

    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      tolerance: 10,
      preventDefault: false,
      onDown: function () {
        prev();
      },
      onUp: function () {
        next();
      }
    });

    window.addEventListener("keydown", function (e) {
      if (sceneTimeline.style.pointerEvents !== "auto") {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prev();
      }
    });
  }

  /* --------------------------
     Boot
  --------------------------- */

  function boot() {
    initLenis();
    initLandingParallax();

    renderStack();
    initTimelineControls();

    btnEnter.addEventListener("click", function () {
      transitionToTimeline();
    });

    gsap.set(sceneTimeline, { y: 18 });

    gsap.to(".blobA", { duration: 7.0, ease: "sine.inOut", y: "+=18", yoyo: true, repeat: -1 });
    gsap.to(".blobB", { duration: 8.0, ease: "sine.inOut", y: "-=14", yoyo: true, repeat: -1 });
    gsap.to(".blobC", { duration: 9.0, ease: "sine.inOut", x: "+=16", yoyo: true, repeat: -1 });
  }

  boot();
})();
