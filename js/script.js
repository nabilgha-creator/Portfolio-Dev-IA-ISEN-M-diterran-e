/*
  STATE
*/
let activeProjectFilter = "all"

let contactFormState = {
  name: "",
  email: "",
  message: "",
}

/*
  DOM
*/
const navToggle = document.querySelector(".nav-toggle")
const siteNav = document.getElementById("site-nav")
const navAnchors = siteNav ? Array.from(siteNav.querySelectorAll("a")) : []

const filterButtons = Array.from(document.querySelectorAll(".filter-btn"))
const projectsSection = document.getElementById("projects")
const projectCards = projectsSection
  ? Array.from(projectsSection.querySelectorAll("article[data-url]"))
  : []

const contactForm = document.getElementById("contactForm")
const formMsg = document.getElementById("formMsg")

const yearSpan = document.querySelector("[data-year]")

/*
  HELPERS
*/
function setNavOpen(isOpen) {
  if (!navToggle || !siteNav) return
  navToggle.setAttribute("aria-expanded", String(isOpen))
  siteNav.classList.toggle("is-open", isOpen) // CSS: .nav-links.is-open { display:flex; }
}

function setFormMessage(text, type) {
  if (!formMsg) return
  formMsg.textContent = text

  // CSS attend: .form-msg.is-error / .form-msg.is-success
  formMsg.classList.remove("is-error", "is-success")
  if (type === "error") formMsg.classList.add("is-error")
  if (type === "success") formMsg.classList.add("is-success")
}

function getProjectCategory(article) {
  // optionnel si tu ajoutes data-category="data|web" plus tard
  const explicit = article.getAttribute("data-category")
  if (explicit) return explicit

  // fallback simple (vu que ton HTML n’a pas data-category)
  const text = (article.textContent || "").toLowerCase()

  if (
    text.includes("etl") ||
    text.includes("dataset") ||
    text.includes("données") ||
    text.includes("data") ||
    text.includes("ia")
  ) {
    return "data"
  }

  if (
    text.includes("html") ||
    text.includes("css") ||
    text.includes("flexbox") ||
    text.includes("web")
  ) {
    return "web"
  }

  return "all"
}

/*
  RENDER
*/
function renderYear() {
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear())
}

function renderProjectFilters() {
  filterButtons.forEach((btn) => {
    const value = btn.dataset.filter || "all"
    btn.classList.toggle("is-active", value === activeProjectFilter)
  })
}

function renderProjects() {
  projectCards.forEach((article) => {
    const category = getProjectCategory(article)
    const show =
      activeProjectFilter === "all" || category === activeProjectFilter

    article.hidden = !show
  })
}

function updateProjectsUI() {
  renderProjectFilters()
  renderProjects()
}

/*
  EVENTS
*/
function setupBurgerMenu() {
  if (!navToggle || !siteNav) return

  // initial: fermé (important)
  setNavOpen(false)

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true"
    setNavOpen(!isOpen)
  })

  // fermer quand on clique sur un lien
  navAnchors.forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false))
  })
}

function setupProjectFilters() {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeProjectFilter = btn.dataset.filter || "all"
      updateProjectsUI()
    })
  })
}

function setupProjectCards() {
  projectCards.forEach((article) => {
    article.style.cursor = "pointer"

    article.addEventListener("click", () => {
      // highlight (CSS: .projects article.is-selected)
      projectCards.forEach((a) => a.classList.remove("is-selected"))
      article.classList.add("is-selected")

      // open link
      const url = article.getAttribute("data-url")
      if (url) window.open(url, "_blank", "noopener,noreferrer")
    })
  })
}

function validateContactForm(data) {
  if (!data.name || !data.email || !data.message) {
    return "Tous les champs sont requis."
  }

  if (data.name.length < 2) {
    return "Le nom doit faire au moins 2 caractères."
  }

  if (data.message.length < 10) {
    return "Le message doit faire au moins 10 caractères."
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return "Veuillez entrer une adresse email valide."
  }

  return null
}

function setupContactForm() {
  if (!contactForm || !formMsg) return

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const nameInput = contactForm.querySelector('input[name="name"]')
    const emailInput = contactForm.querySelector('input[name="email"]')
    const messageInput = contactForm.querySelector('textarea[name="message"]')

    contactFormState.name = (nameInput?.value || "").trim()
    contactFormState.email = (emailInput?.value || "").trim()
    contactFormState.message = (messageInput?.value || "").trim()

    const error = validateContactForm(contactFormState)

    if (error) {
      setFormMessage(error, "error")
      return
    }

    setFormMessage("Votre message a bien été pris en compte.", "success")

    contactForm.reset()
    contactFormState = { name: "", email: "", message: "" }
  })
}

/*
  INIT
*/
renderYear()
setupBurgerMenu()

setupProjectFilters()
setupProjectCards()
updateProjectsUI()

setupContactForm()
