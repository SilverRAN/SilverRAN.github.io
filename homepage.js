(() => {
  "use strict";

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];

  function activateTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const selected = panel.id === tab.getAttribute("aria-controls");
      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  const navbar = document.querySelector(".navbar");
  const desktop = window.matchMedia("(min-width: 750px)");
  let navTop = 0;

  function updateDockedNavigation() {
    document.body.classList.toggle("has-docked-nav", desktop.matches && window.scrollY > navTop);
  }

  function measureNavigation() {
    document.body.classList.remove("has-docked-nav");
    navTop = navbar.getBoundingClientRect().top + window.scrollY;
    updateDockedNavigation();
  }

  window.addEventListener("scroll", updateDockedNavigation, { passive: true });
  window.addEventListener("resize", measureNavigation);
  document.fonts.ready.then(measureNavigation);
  measureNavigation();
})();
