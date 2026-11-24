/* =========================================================
   Legacy · International Solutions
   - intro, smooth scroll, animações de entrada e de scroll
   - cards empilhados, mosaico com parallax, jornada, contadores
   - formulário qualificador que termina no WhatsApp
   ========================================================= */

// >>> TROCAR pelo WhatsApp da Legacy (DDI + DDD + número, só dígitos)
const LEGACY_WHATSAPP = "5561000000000";
// Endereço opcional para receber o lead (CRM, planilha, e-mail). Vazio = não envia.
const LEGACY_LEAD_ENDPOINT = "";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
root.classList.add("js");
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (!location.hash) window.scrollTo(0, 0);

const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
if (!hasGsap) root.classList.add("no-gsap");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(hover: none)").matches;
const track = (name, data = {}) => {
  try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: name, ...data }); } catch (_) {}
};

/* ---------- Smooth scroll (Lenis) ---------- */
let lenis = null;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (window.Lenis && !reduce) {
  lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.95 });
  if (hasGsap) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const scrollToEl = (el) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.5 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" });
};
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  e.preventDefault();
  if (root.classList.contains("menu-open")) closeMenu();
  if (id.length < 2) { lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0, behavior: "smooth" }); return; }
  scrollToEl($(id));
}));

function lockScroll(on) {
  root.classList.toggle("is-locked", on);
  if (lenis) on ? lenis.stop() : lenis.start();
}

/* ---------- Quebra de texto em palavras ---------- */
function splitWords(el, cls = "w") {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.innerHTML = words.map((w) => cls === "w"
    ? `<span class="w" aria-hidden="true"><span>${w}</span></span>`
    : `<span class="${cls}" aria-hidden="true">${w}</span>`).join(" ");
}
$$("[data-split]").forEach((el) => splitWords(el));
$$("[data-words]").forEach((el) => splitWords(el, "wd"));

/* ---------- Intro ---------- */
const intro = $(".intro");
let seen = false;
try { seen = sessionStorage.getItem("legacy-intro") === "1"; sessionStorage.setItem("legacy-intro", "1"); } catch (_) {}
function endIntro() {
  if (!intro || intro.classList.contains("is-gone")) return;
  intro.classList.add("is-out");
  setTimeout(() => intro.classList.add("is-gone"), 1000);
  heroIn(0.35);
}
if (!hasGsap || reduce || seen) {
  root.classList.add("no-intro");
  intro?.classList.add("is-gone");
  requestAnimationFrame(() => heroIn(0));
} else {
  lockScroll(true);
  const go = () => setTimeout(() => { lockScroll(false); endIntro(); }, 1500);
  if (document.readyState === "complete") go(); else addEventListener("load", go, { once: true });
  setTimeout(() => { lockScroll(false); endIntro(); }, 4500); // segurança
}

/* ---------- Hero ---------- */
let heroDone = false;
function heroIn(delay) {
  if (heroDone || !hasGsap) return;
  heroDone = true;
  const tl = gsap.timeline({ delay });
  tl.fromTo(".hero__media img", { scale: 1.28 }, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
    .fromTo(".hero__title .w > span", { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.06 }, 0.25)
    .fromTo([".hero__eyebrow", ".hero__lead", ".hero__ctas"], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.55)
    .fromTo(".hero__foot > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.9)
    .fromTo(".hdr__in", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0.5);
}
if (hasGsap) {
  gsap.set(".hero__title .w > span", { yPercent: 115 });
  gsap.set([".hero__eyebrow", ".hero__lead", ".hero__ctas", ".hero__foot > *"], { opacity: 0 });
  gsap.to(".hero__media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__body", { y: -90, opacity: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
}

/* ---------- Header ---------- */
const hdr = $(".hdr"), hero = $(".hero"), fab = $(".fab");
let lastY = 0, fabShown = false;
function onScroll() {
  const y = window.scrollY;
  const heroH = hero.offsetHeight;
  hdr.classList.toggle("is-solid", y > heroH * 0.75);
  hdr.classList.toggle("is-hidden", y > lastY && y > heroH && !root.classList.contains("menu-open"));
  const showFab = y > heroH * 0.5;
  fab.classList.toggle("is-on", showFab);
  if (showFab && !fabShown) {
    fabShown = true;
    fab.classList.add("is-wide");
    setTimeout(() => fab.classList.remove("is-wide"), 4200);
  }
  lastY = y;
}
if (lenis) lenis.on("scroll", onScroll); else addEventListener("scroll", onScroll, { passive: true });
onScroll();

// link ativo do menu
const navLinks = $$(".nav a");
const io = new IntersectionObserver((ents) => ents.forEach((en) => {
  if (!en.isIntersecting) return;
  navLinks.forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === `#${en.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach((s) => io.observe(s));

// idioma (apenas visual na proposta)
$$(".lang button").forEach((b) => b.addEventListener("click", () => {
  $$(".lang button").forEach((x) => x.classList.toggle("is-on", x === b));
}));

/* ---------- Menu mobile ---------- */
const burger = $(".burger"), mnav = $(".mnav");
function openMenu() { root.classList.add("menu-open"); burger.setAttribute("aria-expanded", "true"); mnav.setAttribute("aria-hidden", "false"); lockScroll(true); }
function closeMenu() { root.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); mnav.setAttribute("aria-hidden", "true"); lockScroll(false); }
burger.addEventListener("click", () => root.classList.contains("menu-open") ? closeMenu() : openMenu());

/* =========================================================
   ANIMAÇÕES DE SCROLL
   ========================================================= */
if (hasGsap && !reduce) {
  const mm = gsap.matchMedia();

  // títulos palavra a palavra
  $$("[data-split]").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.fromTo($$(".w > span", el), { yPercent: 115 }, {
      yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.045,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // entradas suaves
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }),
  });

  // imagem "Sobre": abre com clip-path e parallax
  const clip = $("[data-clip]");
  if (clip) {
    gsap.fromTo(clip, { clipPath: "inset(14% 10% 14% 10% round 22px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none",
      scrollTrigger: { trigger: clip, start: "top 95%", end: "top 30%", scrub: true },
    });
    gsap.fromTo($("img", clip), { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: clip, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".sobre__badge", { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: clip, start: "top 60%", once: true } });
  }

  // linhas que se desenham
  $$(".move__lines path").forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".move", start: `top ${85 - i * 4}%`, end: "top 20%", scrub: 1 },
    });
  });

  // pilares empilhados
  mm.add("(min-width: 861px)", () => {
    const cards = $$(".pilar");
    cards.forEach((c, i) => {
      const img = $(".pilar__img img", c);
      gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 20%", scrub: true } });
      if (i === cards.length - 1) return;
      gsap.to($(".pilar__in", c), {
        scale: 0.92 + i * 0.02, opacity: 0.55, ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 25%", scrub: true },
      });
    });
  });

  // mosaico: colunas em velocidades diferentes
  mm.add("(min-width: 761px)", () => {
    $$(".mosaic__col").forEach((col) => {
      const s = +col.dataset.speed || 0;
      gsap.fromTo(col, { y: -s }, { y: s * 1.4, ease: "none", scrollTrigger: { trigger: ".mosaic__grid", start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  gsap.from(".tile", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".mosaic__grid", start: "top 85%", once: true } });

  // equipe
  gsap.from(".mate", { y: 70, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".team", start: "top 85%", once: true } });

  // globo entra
  gsap.from(".globe", { scale: 0.85, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".globe", start: "top 85%", once: true } });

  // legado: parallax + palavras acendendo
  gsap.fromTo(".legado__media", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".legado", start: "top bottom", end: "bottom top", scrub: true } });
  const wds = $$(".legado__q .wd");
  gsap.to(wds, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".legado", start: "top 65%", end: "center 40%", scrub: true } });

  // contato
  gsap.fromTo(".contato__box", { clipPath: "inset(8% 4% 8% 4% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none", scrollTrigger: { trigger: ".contato__box", start: "top 95%", end: "top 45%", scrub: true } });
  gsap.from(".subjects button", { x: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".subjects", start: "top 85%", once: true } });
} else {
  $$(".legado__q .wd").forEach((w) => (w.style.opacity = 1));
}

/* ---------- Contadores ---------- */
const fmt = (n) => Math.round(n).toLocaleString("pt-BR");
const cio = new IntersectionObserver((ents) => ents.forEach((en) => {
  if (!en.isIntersecting) return;
  cio.unobserve(en.target);
  const el = en.target, to = +el.dataset.count, pre = el.dataset.prefix || "";
  if (reduce) { el.textContent = pre + fmt(to); return; }
  const t0 = performance.now(), dur = 2000;
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
    el.textContent = pre + fmt(to * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}), { threshold: 0.6 });
$$("[data-count]").forEach((el) => { el.textContent = (el.dataset.prefix || "") + "0"; cio.observe(el); });

/* ---------- Toques (celular): cards revelam texto ---------- */
if (isTouch) {
  $$(".mate").forEach((m) => m.addEventListener("click", () => {
    const on = !m.classList.contains("is-on");
    $$(".mate").forEach((x) => x.classList.remove("is-on"));
    m.classList.toggle("is-on", on);
  }));
}

/* ---------- Jornada ---------- */
const jr = $(".jr"), jrItems = $$(".jr__item"), jrTrack = $(".jr__track"), jrBar = $(".jr__bar i");
let jrIdx = 0, jrTimer = null, jrInView = false, jrHover = false;
function jrGo(i, user) {
  jrIdx = (i + jrItems.length) % jrItems.length;
  jrItems.forEach((it, k) => {
    it.classList.toggle("is-on", k === jrIdx);
    it.classList.toggle("is-past", k < jrIdx);
  });
  const w = matchMedia("(max-width: 760px)").matches ? 34 : 20;
  jrTrack.style.transform = `translateX(-${jrIdx * w}%)`;
  jrBar.style.width = `${((jrIdx + 1) / jrItems.length) * 100}%`;
  jrBar.style.transition = "width .9s cubic-bezier(.22,1,.36,1)";
  if (user) { track("jornada_step", { step: jrIdx + 1 }); jrAuto(); }
}
function jrAuto() {
  clearInterval(jrTimer);
  if (reduce) return;
  jrTimer = setInterval(() => { if (jrInView && !jrHover && !document.hidden) jrGo(jrIdx + 1); }, 5200);
}
$(".js-prev").addEventListener("click", () => jrGo(jrIdx - 1, true));
$(".js-next").addEventListener("click", () => jrGo(jrIdx + 1, true));
jrItems.forEach((it, k) => $("button", it).addEventListener("click", () => jrGo(k, true)));
jr.addEventListener("mouseenter", () => (jrHover = true));
jr.addEventListener("mouseleave", () => (jrHover = false));
let jrX = null;
jr.addEventListener("pointerdown", (e) => (jrX = e.clientX));
jr.addEventListener("pointerup", (e) => {
  if (jrX === null) return;
  const dx = e.clientX - jrX; jrX = null;
  if (Math.abs(dx) > 40) jrGo(jrIdx + (dx < 0 ? 1 : -1), true);
});
new IntersectionObserver(([en]) => (jrInView = en.isIntersecting), { threshold: 0.4 }).observe(jr);
jrGo(0); jrAuto();
addEventListener("resize", () => jrGo(jrIdx));

/* ---------- FAQ com abertura suave ---------- */
$$(".acc__it").forEach((d) => {
  const s = $("summary", d), b = $(".acc__bd", d);
  s.addEventListener("click", (e) => {
    e.preventDefault();
    const ease = "cubic-bezier(.22,1,.36,1)";
    if (d.open) {
      const a = b.animate([{ height: b.scrollHeight + "px" }, { height: "0px" }], { duration: 450, easing: ease });
      a.onfinish = () => { d.open = false; hasGsap && ScrollTrigger.refresh(); };
    } else {
      $$(".acc__it[open]").forEach((o) => o !== d && $("summary", o).click());
      d.open = true;
      const a = b.animate([{ height: "0px" }, { height: b.scrollHeight + "px" }], { duration: 550, easing: ease });
      a.onfinish = () => hasGsap && ScrollTrigger.refresh();
      track("faq_open", { q: s.textContent.trim() });
    }
  });
});

/* =========================================================
   FORMULÁRIO QUALIFICADOR → WhatsApp
   ========================================================= */
const lead = $("#lead"), form = $(".lead__form", lead);
const fsets = $$(".q[data-q]", form);
const nextBtn = $(".lead__next", lead), backBtn = $(".lead__back", lead);
let pos = 0, leadTrigger = null;
form.setAttribute("data-lenis-prevent", "");

const val = (name) => $(`input[name="${name}"]:checked`, form)?.value || "";
const flow = () => ["solucao", val("solucao") === "Saúde global" ? "cobertura" : "patrimonio", "momento", "atendimento", "contato"];
const answered = (name) => name === "contato" || !!val(name);

function showStep(i) {
  const f = flow();
  pos = Math.max(0, Math.min(i, f.length - 1));
  const name = f[pos];
  fsets.forEach((q) => q.classList.toggle("is-on", q.dataset.q === name));
  $(".q--done", form).classList.remove("is-on");
  $(".lead__progress i").style.width = `${((pos + 1) / (f.length + 1)) * 100}%`;
  $(".js-step", lead).textContent = pos + 1;
  $(".js-total", lead).textContent = f.length;
  backBtn.classList.toggle("is-on", pos > 0);
  nextBtn.disabled = !answered(name);
  $("span", nextBtn).textContent = name === "contato" ? "Ir para o WhatsApp" : "Continuar";
  track("lead_step", { step: pos + 1, pergunta: name });
}
function openLead(solucao, trigger) {
  leadTrigger = trigger || document.activeElement;
  form.reset();
  $(".err", form).textContent = "";
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  lead.classList.remove("is-done");
  let start = 0;
  if (solucao) {
    const r = $$('input[name="solucao"]', form).find((x) => x.value === solucao);
    if (r) { r.checked = true; start = 1; }
  }
  showStep(start);
  lead.classList.add("is-open");
  lead.setAttribute("aria-hidden", "false");
  lockScroll(true);
  track("lead_open", { solucao: solucao || "", origem: trigger?.className || "" });
  setTimeout(() => $(".q.is-on input", form)?.focus({ preventScroll: true }), 450);
}
function closeLead() {
  lead.classList.remove("is-open");
  lead.setAttribute("aria-hidden", "true");
  lockScroll(false);
  leadTrigger?.focus?.({ preventScroll: true });
}
$$("[data-open-lead]").forEach((b) => b.addEventListener("click", (e) => {
  e.preventDefault();
  if (root.classList.contains("menu-open")) closeMenu();
  openLead(b.dataset.solucao || null, b);
}));
$$("[data-close-lead]", lead).forEach((b) => b.addEventListener("click", closeLead));

form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  nextBtn.disabled = false;
  const at = pos;
  setTimeout(() => { if (pos === at && lead.classList.contains("is-open")) showStep(at + 1); }, 380);
});
backBtn.addEventListener("click", () => pos > 0 && showStep(pos - 1));
nextBtn.addEventListener("click", () => {
  const f = flow();
  if (pos < f.length - 1) { if (answered(f[pos])) showStep(pos + 1); return; }
  submitLead();
});
form.addEventListener("submit", (e) => { e.preventDefault(); if (flow()[pos] === "contato") submitLead(); });
$$(".q--form input", form).forEach((inp) => inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitLead(); } }));

// máscara de telefone (Brasil) ou formato internacional com "+"
const tel = $('input[name="whatsapp"]', form);
tel.addEventListener("input", () => {
  if (tel.value.trim().startsWith("+")) { tel.value = "+" + tel.value.replace(/[^\d ]/g, "").slice(0, 20); return; }
  const d = tel.value.replace(/\D/g, "").slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  tel.value = out;
});

function submitLead() {
  const fd = new FormData(form);
  const nome = (fd.get("nome") || "").trim();
  const intl = tel.value.trim().startsWith("+");
  const fone = (fd.get("whatsapp") || "").replace(/\D/g, "");
  const err = $(".err", form);
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  if (nome.length < 2) { $('input[name="nome"]', form).classList.add("is-bad"); err.textContent = "Conte para nós como podemos chamar você."; return; }
  if (fone.length < (intl ? 8 : 10)) { tel.classList.add("is-bad"); err.textContent = "Confira o seu WhatsApp com DDD (ou com + e o código do país)."; return; }
  if (!fd.get("lgpd")) { err.textContent = "Precisamos da sua autorização para entrar em contato."; return; }
  err.textContent = "";

  const payload = {
    nome, whatsapp: (intl ? "+" : "") + fone, cidade: (fd.get("cidade") || "").trim(),
    solucao: val("solucao"), patrimonio: val("patrimonio"), cobertura: val("cobertura"),
    momento: val("momento"), atendimento: val("atendimento"),
    origem: "Site Legacy", pagina: location.href, data: new Date().toISOString(),
  };
  const linhas = [
    "Olá! Vim pelo site da Legacy e gostaria de falar com um especialista.",
    "",
    `• Solução: ${payload.solucao || "-"}`,
    payload.patrimonio && payload.solucao !== "Saúde global" ? `• Patrimônio a estruturar: ${payload.patrimonio}` : null,
    payload.cobertura && payload.solucao === "Saúde global" ? `• Cobertura: ${payload.cobertura}` : null,
    payload.momento ? `• Momento: ${payload.momento}` : null,
    payload.atendimento ? `• Prefiro atendimento por: ${payload.atendimento}` : null,
    payload.cidade ? `• Cidade / país: ${payload.cidade}` : null,
    "",
    `Meu nome é ${nome}.`,
  ].filter((l) => l !== null);
  const url = `https://wa.me/${LEGACY_WHATSAPP}?text=${encodeURIComponent(linhas.join("\n"))}`;
  $(".js-wa", form).href = url;
  $(".js-name", form).textContent = nome.split(" ")[0];

  if (LEGACY_LEAD_ENDPOINT) {
    fetch(LEGACY_LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  } else {
    console.info("[lead]", payload);
  }
  track("lead_submit", { solucao: payload.solucao, patrimonio: payload.patrimonio, cobertura: payload.cobertura, momento: payload.momento, atendimento: payload.atendimento });

  fsets.forEach((q) => q.classList.remove("is-on"));
  $(".q--done", form).classList.add("is-on");
  $(".lead__progress i").style.width = "100%";
  lead.classList.add("is-done");
  window.open(url, "_blank", "noopener");
}

/* ---------- Esc fecha o que estiver aberto ---------- */
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (lead.classList.contains("is-open")) return closeLead();
  if (root.classList.contains("menu-open")) closeMenu();
});

addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
