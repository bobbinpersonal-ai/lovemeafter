// Client-side wishlist: saved product handles live in localStorage only.
// No account/backend required. Fires "wishlist:change" whenever it changes
// so the header count and any button on the page can stay in sync.
(function () {
  if (window.__lmaWishlist) return;

  var STORAGE_KEY = 'lma_wishlist';

  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // Storage unavailable (private browsing, disabled, etc). Fail silently;
      // the toggle buttons simply won't persist across reloads.
    }
    document.dispatchEvent(new CustomEvent('wishlist:change', { detail: { handles: list } }));
  }

  function has(handle) {
    return read().indexOf(handle) !== -1;
  }

  function toggle(handle) {
    var list = read();
    var index = list.indexOf(handle);
    if (index === -1) {
      list.push(handle);
    } else {
      list.splice(index, 1);
    }
    write(list);
    return index === -1;
  }

  function count() {
    return read().length;
  }

  window.__lmaWishlist = { has: has, toggle: toggle, count: count, read: read };

  function updateButtonState(button) {
    var handle = button.dataset.wishlistHandle;
    var active = has(handle);
    button.classList.toggle('wishlist-button--active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  function updateCountBubbles() {
    var n = count();
    document.querySelectorAll('[data-wishlist-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.wishlist-button');
    if (!button) return;
    event.preventDefault();
    toggle(button.dataset.wishlistHandle);
    updateButtonState(button);
  });

  document.addEventListener('wishlist:change', function () {
    document.querySelectorAll('.wishlist-button').forEach(updateButtonState);
    updateCountBubbles();
  });

  function init() {
    document.querySelectorAll('.wishlist-button').forEach(updateButtonState);
    updateCountBubbles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
