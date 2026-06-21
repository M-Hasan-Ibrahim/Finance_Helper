const tabs = document.querySelectorAll("[data-section-tab]");
const panels = document.querySelectorAll(".section-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.sectionTab;
    });
  });
});
