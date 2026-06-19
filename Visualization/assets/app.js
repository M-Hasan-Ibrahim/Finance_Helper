const sectionTabs = document.querySelectorAll("[data-section-tab]");
const sectionPanels = document.querySelectorAll(".section-panel");

sectionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    sectionTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    sectionPanels.forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.sectionTab;
    });
  });
});