/* ============================================================
   ABUELA LATIN FOOD — interactions
   Shared across all pages. Every block is feature-detected,
   so the same file runs safely on Home / Menu / Catering.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Business config — EDIT THESE ----------------------------------
     whatsapp : full international number, digits only (e.g. 15551234567)
     email    : where catering requests should land
     endpoint : optional POST URL (Formspree / your CRM). Leave "" to skip.
  --------------------------------------------------------------------- */
  const CONFIG = {
    whatsapp: "16479726553",
    email: "hello@abuelalatinfood.com",
    endpoint: ""
  };
  window.ABUELA = CONFIG;

  const $ = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));
  const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);

  /* ============================================================
     HEADER — scrolled state + hide on scroll down
     ============================================================ */
  const header = $("#header");
  if (header) {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 24);
      if (y > 320 && y > last) header.classList.add("hidden");
      else header.classList.remove("hidden");
      last = y;
    };
    on(window, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE DRAWER
     ============================================================ */
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  const openDrawer = () => { drawer && drawer.classList.add("open"); scrim && scrim.classList.add("show"); document.body.style.overflow = "hidden"; };
  const closeDrawer = () => { drawer && drawer.classList.remove("open"); scrim && scrim.classList.remove("show"); document.body.style.overflow = ""; };
  on($("#menuToggle"), "click", openDrawer);
  on($("#drawerClose"), "click", closeDrawer);
  on(scrim, "click", closeDrawer);
  $$("#drawer a").forEach(a => on(a, "click", closeDrawer));
  on(document, "keydown", e => { if (e.key === "Escape") closeDrawer(); });

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  const revealEls = $$(".reveal, .reveal-scale");
  const revealAll = () => revealEls.forEach(el => el.classList.add("in"));
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
    // Failsafe: if the observer never fires (e.g. tab loaded in the background so
    // visibilityState is "hidden", or a flaky engine), nothing would ever be
    // revealed. After a beat, if NOTHING has been revealed yet, show everything.
    // On a normal visible load the observer has already revealed above-the-fold
    // content by now, so this no-ops and the scroll animations are preserved.
    setTimeout(() => { if (!document.querySelector(".reveal.in, .reveal-scale.in")) revealAll(); }, 1500);
  } else {
    revealAll();
  }

  /* ============================================================
     COUNTERS
     ============================================================ */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const dec = (el.dataset.count.split(".")[1] || "").length;
        const dur = 1500; const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(dec);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ============================================================
     TESTIMONIAL CAROUSEL
     ============================================================ */
  const track = $("#tstTrack");
  if (track) {
    const slides = $$(".tst-slide", track);
    const dotsWrap = $("#tstDots");
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "tst-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to review " + (i + 1));
      on(d, "click", () => go(i));
      dotsWrap && dotsWrap.appendChild(d);
    });
    const dots = dotsWrap ? $$(".tst-dot", dotsWrap) : [];
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("active", k === idx));
      restart();
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    on($("#tstNext"), "click", () => go(idx + 1));
    on($("#tstPrev"), "click", () => go(idx - 1));
    restart();
  }

  /* ============================================================
     MENU FILTER
     ============================================================ */
  const filterBtns = $$(".filter-btn");
  if (filterBtns.length) {
    const cards = $$(".menu-card");
    const empty = $("#menuEmpty");
    filterBtns.forEach(btn => on(btn, "click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      let shown = 0;
      cards.forEach(card => {
        const match = cat === "all" || (card.dataset.cat || "").split(" ").includes(cat);
        card.classList.toggle("hide", !match);
        if (match) { shown++; card.style.animation = "fade 0.5s var(--ease)"; setTimeout(() => card.style.animation = "", 500); }
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    }));
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item); const a = $(".faq-a", item);
    on(q, "click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach(o => { o.classList.remove("open"); const oa = $(".faq-a", o); if (oa) oa.style.maxHeight = null; });
      if (!isOpen) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ============================================================
     GALLERY LIGHTBOX
     ============================================================ */
  const lb = $("#lightbox");
  if (lb) {
    const items = $$(".gal-item");
    const lbImg = $("#lbImg"); const lbCap = $("#lbCap");
    let ci = 0;
    const build = items.map(it => ({ src: $("img", it).getAttribute("src"), cap: it.dataset.cap || "" }));
    const show = (i) => {
      ci = (i + build.length) % build.length;
      lbImg.setAttribute("src", build[ci].src);
      lbCap.textContent = build[ci].cap;
      lb.classList.add("show"); document.body.style.overflow = "hidden";
    };
    const hide = () => { lb.classList.remove("show"); document.body.style.overflow = ""; };
    items.forEach((it, i) => on(it, "click", () => show(i)));
    on($("#lbClose"), "click", hide);
    on($("#lbPrev"), "click", () => show(ci - 1));
    on($("#lbNext"), "click", () => show(ci + 1));
    on(lb, "click", e => { if (e.target === lb) hide(); });
    on(document, "keydown", e => {
      if (!lb.classList.contains("show")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowRight") show(ci + 1);
      if (e.key === "ArrowLeft") show(ci - 1);
    });
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  const toTop = $("#toTop");
  if (toTop) {
    on(window, "scroll", () => toTop.classList.toggle("show", window.scrollY > 600), { passive: true });
    on(toTop, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ============================================================
     TOAST
     ============================================================ */
  function toast(msg, type) {
    let wrap = $(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "toast" + (type === "err" ? " err" : "");
    t.innerHTML = `<i class="fa-solid ${type === "err" ? "fa-triangle-exclamation" : "fa-circle-check"}"></i><span>${msg}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 4200);
  }
  window.abuelaToast = toast;

  /* ============================================================
     QUOTE FORM — stepper, live estimate, submit
     ============================================================ */
  const form = $("#quoteForm");
  if (form) {
    const steps = $$(".fstep", form);
    const stepPips = $$(".stepper .st");
    let cur = 0;
    const perPerson = { family: 17, fiesta: 25, grand: 33 };
    const trayServes = 10;

    const showStep = (n) => {
      cur = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach((s, i) => s.classList.toggle("active", i === cur));
      stepPips.forEach((p, i) => {
        p.classList.toggle("active", i === cur);
        p.classList.toggle("done", i < cur);
      });
      const back = $("#fBack"), next = $("#fNext"), submit = $("#fSubmit");
      if (back) back.classList.toggle("hidden", cur === 0);
      if (next) next.style.display = cur === steps.length - 1 ? "none" : "inline-flex";
      if (submit) submit.style.display = cur === steps.length - 1 ? "inline-flex" : "none";
    };

    const validateStep = () => {
      const active = steps[cur];
      const required = $$("[required]", active);
      for (const f of required) {
        if (!f.value.trim()) { f.focus(); f.style.borderColor = "var(--chili)"; toast("Please fill in the highlighted field.", "err"); return false; }
        f.style.borderColor = "";
      }
      // step 0 must have an event type chosen
      if (cur === 0 && $$("input[name=eventType]:checked", form).length === 0) {
        toast("Pick the type of event you're planning.", "err"); return false;
      }
      return true;
    };

    on($("#fNext"), "click", () => { if (validateStep()) showStep(cur + 1); });
    on($("#fBack"), "click", () => showStep(cur - 1));

    /* live estimate */
    const guestInput = $("#guests");
    const guestOuts = $$("#guestVal, #guestValLabel");
    const estOut = $("#estAmount");
    const estTrays = $("#estTrays");
    const getPkg = () => { const c = $("input[name=pkg]:checked", form); return c ? c.value : "fiesta"; };
    const updateEstimate = () => {
      const g = parseInt(guestInput ? guestInput.value : 40, 10) || 0;
      guestOuts.forEach(o => o.textContent = g);
      const pp = perPerson[getPkg()] || 25;
      const low = Math.round(g * pp / 5) * 5;
      const high = Math.round(g * pp * 1.18 / 5) * 5;
      if (estOut) estOut.textContent = g ? `$${low}–$${high}` : "—";
      if (estTrays) estTrays.textContent = Math.max(1, Math.ceil(g / trayServes));
    };
    on(guestInput, "input", updateEstimate);
    $$("input[name=pkg]", form).forEach(r => on(r, "change", updateEstimate));
    updateEstimate();

    /* prefill package from ?pkg= or data attr set by pricing buttons */
    const params = new URLSearchParams(location.search);
    const wantPkg = params.get("pkg");
    if (wantPkg) { const r = $(`input[name=pkg][value="${wantPkg}"]`, form); if (r) { r.checked = true; updateEstimate(); } }

    /* package cards preselect the matching option, then jump to the form */
    $$("[data-pkg]").forEach(btn => on(btn, "click", (e) => {
      const r = $(`input[name=pkg][value="${btn.dataset.pkg}"]`, form);
      if (r) { r.checked = true; updateEstimate(); }
      const q = $("#quote");
      if (q) { e.preventDefault(); q.scrollIntoView({ behavior: "smooth", block: "start" }); }
      toast("Great pick! Fill in a couple details for your quote.");
    }));

    /* submit */
    on(form, "submit", async (e) => {
      e.preventDefault();
      if (!validateStep()) return;
      if (form.companyWebsite && form.companyWebsite.value) return; // honeypot
      const data = Object.fromEntries(new FormData(form).entries());
      const dishes = $$("input[name=dishes]:checked", form).map(d => d.value).join(", ");
      const g = guestInput ? guestInput.value : "";
      const lead = {
        source: "abuela-website",
        name: data.name, email: data.email, phone: data.phone,
        eventType: data.eventType, eventDate: data.eventDate,
        guests: g, package: getPkg(), dishes,
        message: data.message || "", submittedAt: new Date().toISOString()
      };

      const btn = $("#fSubmit"); const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

      // optional server / CRM delivery
      if (CONFIG.endpoint) {
        try {
          await fetch(CONFIG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
        } catch (_) { /* non-blocking — WhatsApp handoff still delivers */ }
      }

      // WhatsApp handoff (works with zero backend)
      const msg = encodeURIComponent(
        `¡Hola Abuela! I'd like a catering quote.%0A%0A` +
        `• Event: ${lead.eventType}%0A• Date: ${lead.eventDate || "TBD"}%0A• Guests: ${lead.guests}%0A` +
        `• Package: ${lead.package}%0A• Dishes: ${dishes || "open to suggestions"}%0A` +
        `• Name: ${lead.name}%0A• Email: ${lead.email}%0A• Phone: ${lead.phone || "—"}%0A` +
        `• Notes: ${lead.message || "—"}`
      ).replace(/%250A/g, "%0A");

      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = orig;
        form.querySelector(".form-body").style.display = "none";
        const stepperEl = $(".stepper", form); if (stepperEl) stepperEl.style.display = "none";
        const success = $("#formSuccess");
        const waBtn = $("#successWa");
        if (waBtn) waBtn.setAttribute("href", `https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        toast("Request ready! Confirm on WhatsApp so Abuela gets it instantly.");
      }, 700);
    });

    showStep(0);
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ============================================================
     HERO PARALLAX (pointer)
     ============================================================ */
  const heroVisual = $("#heroVisual");
  if (heroVisual && window.matchMedia("(pointer:fine)").matches) {
    on(heroVisual, "mousemove", (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      $$("[data-float]", heroVisual).forEach(el => {
        const d = parseFloat(el.dataset.float) || 10;
        el.style.transform = `translate(${x * d}px, ${y * d}px)`;
      });
    });
    on(heroVisual, "mouseleave", () => $$("[data-float]", heroVisual).forEach(el => el.style.transform = ""));
  }
})();
