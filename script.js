const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const yearNode = document.querySelector("#year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sectionLinks = navLinks.filter((link) =>
  link.getAttribute("href")?.startsWith("#")
);

const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = `#${entry.target.id}`;
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === id;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: 0.05,
  }
);

sections.forEach((section) => observer.observe(section));

const emailLinks = [...document.querySelectorAll("[data-email-link]")];

const flashEmailFeedback = (node) => {
  if (!node.classList.contains("button")) {
    return;
  }

  const originalLabel = node.dataset.originalLabel || node.textContent.trim();
  node.dataset.originalLabel = originalLabel;
  node.textContent = "Email copied";
  node.classList.add("email-feedback");

  window.setTimeout(() => {
    node.textContent = originalLabel;
    node.classList.remove("email-feedback");
  }, 1800);
};

emailLinks.forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();

    const emailAddress =
      link.dataset.emailAddress || link.getAttribute("href")?.replace("mailto:", "");
    const mailtoHref = link.getAttribute("href");

    if (emailAddress && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(emailAddress);
        flashEmailFeedback(link);
      } catch (error) {
        // Ignore clipboard failures and continue with the mailto fallback.
      }
    }

    if (mailtoHref) {
      window.location.href = mailtoHref;
    }
  });
});
