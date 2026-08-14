if (!window.__lmaSizeGuideInit) {
  window.__lmaSizeGuideInit = true;

  document.addEventListener('click', (event) => {
    const tabButton = event.target.closest('[data-size-tab]');
    if (tabButton) {
      const modal = tabButton.closest('.size-guide-modal');
      if (!modal) return;
      const target = tabButton.dataset.sizeTab;

      modal.querySelectorAll('[data-size-tab]').forEach((btn) => {
        const active = btn === tabButton;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      modal.querySelectorAll('[data-size-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.sizePanel !== target;
      });
      return;
    }

    const unitButton = event.target.closest('[data-size-unit]');
    if (unitButton) {
      const modal = unitButton.closest('.size-guide-modal');
      if (!modal) return;
      const unit = unitButton.dataset.sizeUnit;

      modal.querySelectorAll('[data-size-unit]').forEach((btn) => {
        btn.classList.toggle('is-active', btn === unitButton);
      });

      modal.querySelectorAll('[data-unit]').forEach((el) => {
        el.hidden = el.dataset.unit !== unit;
      });
    }
  });
}
