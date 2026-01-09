/* script.js — adapté à ton HTML (Portfolio Nabil)
   - Reveal au scroll (sections, projets, skills)
   - Cartes projets cliquables (si on met data-url sur <article>)
   - Bouton "Retour en haut"
   - Toast (petite notif)
   - Année auto dans le footer (si tu mets <span data-year>)
   - Respecte ton HTML actuel (ne casse pas si un élément n'existe pas)
*/

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // --- CSS injecté pour les effets (reveal / toast / top button)
  const injectedCSS = `
    .js-reveal{
      opacity: 0;
      transform: translateY(10px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .js-reveal.is-visible{
      opacity: 1;
      transform: translateY(0);
    }

    .js-toast{
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%);
      background: rgba(17, 24, 39, .92);
      border: 1px solid rgba(255,255,255,.12);
      color: #e5e7eb;
      padding: 10px 14px;
      border-radius: 12px;
      box-shadow: 0 12px 30px rgba(0,0,0,.35);
      font-weight: 700;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
    }
    .js-toast.is-on{
      opacity: 1;
      transform: translateX(-50%) translateY(-4px);
    }

    .js-topbtn{
      position: fixed;
      right: 18px;
      bottom: 18px;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(96,165,250,.14);
      color: #e5e7eb;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 12px 30px rgba(0,0,0,.25);
      z-index: 9999;
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
    }
    .js-topbtn.is-on{
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .js-topbtn:focus{
      outline: 2px solid rgba(96,165,250,.55);
      outline-offset: 3px;
    }
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = injectedCSS;
  document.head.appendChild(styleEl);

  // --- Toast
  const toast = document.createElement("div");
  toast.className = "js-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  let toastTimer = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 1400);
  };

  // --- Année auto (OPTIONNEL)
  // Si tu mets <span data-year></span> dans ton footer
  const yearTarget = $("[data-year]");
  if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());

  // --- Reveal au scroll (adapté à ton HTML)
  // Tes sections : <main> contient plusieurs <section>
  // Projets : <section class="projects"> avec <article>
  // Compétences : <section class="skills-section"> avec <ul class="skills"> etc.
  const revealTargets = [
    ...$$("main > section"),          // sections principales du main
    ...$$(".projects article"),       // cartes projets
    ...$$(".skills > li"),            // catégories skills
    ...$$(".contact-links a"),        // icônes contact
  ];

 if ("IntersectionObserver" in window && revealTargets.length) {
  revealTargets.forEach((el) => el.classList.add("js-reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible"); // <-- permet de rejouer
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => io.observe(el));
}


  // --- Rendre les articles projets cliquables (OPTIONNEL)
  // Ajoute data-url sur tes <article> :
  // <article data-url="https://github.com/...">...</article>
  $$(".projects article[data-url]").forEach((card) => {
    card.style.cursor = "pointer";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "Ouvrir le projet");

    const open = () => {
      const url = card.getAttribute("data-url");
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
    };

    card.addEventListener("click", (e) => {
      // Si tu as un <a> dans la carte, on le laisse fonctionner
      if (e.target && e.target.closest && e.target.closest("a")) return;
      open();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // --- Bouton "Retour en haut"
  const topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "js-topbtn";
  topBtn.setAttribute("aria-label", "Retour en haut");
  topBtn.textContent = "↑";
  document.body.appendChild(topBtn);

  const toggleTopBtn = () => {
    if (window.scrollY > 450) topBtn.classList.add("is-on");
    else topBtn.classList.remove("is-on");
  };

  window.addEventListener("scroll", toggleTopBtn, { passive: true });
  toggleTopBtn();

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Sécurité : ouvrir les liens externes en mode safe (sans casser ton HTML)
  // Tu as déjà target="_blank". On ajoute rel si absent.
  $$('a[target="_blank"]').forEach((a) => {
    const rel = (a.getAttribute("rel") || "").toLowerCase();
    if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  // --- Petite animation click sur icônes contact (feedback)
  $$(".contact-links a").forEach((a) => {
    a.addEventListener("click", () => showToast("Ouverture…"));
  });

  // --- Smooth scroll (OPTIONNEL)
  // Actif seulement si un jour tu ajoutes des ancres type <a href="#projects">
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });
})();

// --- Burger menu (mobile)
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggleBtn && nav) {
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Fermer quand on clique un lien du menu
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Fermer avec Echap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Fermer si clic en dehors
  document.addEventListener("click", (e) => {
    const clickedInside = nav.contains(e.target) || toggleBtn.contains(e.target);
    if (!clickedInside) closeMenu();
  });
}
