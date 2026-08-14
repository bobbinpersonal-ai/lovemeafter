// Wires the custom .jb-option-btn color/size buttons on the LOVEMEAFTER product
// page to real Shopify variant data: matches the selected option combination
// against product.variants, then updates the hidden form id, price, and
// add-to-bag button state. Dispatches "lma:variant:change" so other components
// on the page (sticky add-to-cart) can stay in sync.
(function () {
  if (window.__lmaPdpInit) return;
  window.__lmaPdpInit = true;

  function moneyFormat(cents, sample) {
    if (typeof sample === 'string' && sample.match(/[\d.,]+/)) {
      const digits = String(Math.round(cents)).padStart(3, '0');
      const decimal = digits.slice(-2);
      const whole = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return sample.replace(/[\d.,]+/, `${whole}.${decimal}`);
    }
    return `$${(cents / 100).toFixed(2)}`;
  }

  function initProduct(form) {
    const sectionId = form.dataset.sectionId;
    const variantsScript = document.getElementById(`ProductVariants-${sectionId}`);
    if (!variantsScript) return;

    let variants;
    try {
      variants = JSON.parse(variantsScript.textContent);
    } catch (e) {
      return;
    }

    const optionGroups = Array.from(form.querySelectorAll('.jb-option-group'));
    const idInput = form.querySelector('input[name="id"]');
    const priceEl = document.getElementById(`ProductPrice-${sectionId}`);
    const submitButton = document.getElementById(`ProductSubmitButton-${sectionId}`);
    const submitText = submitButton ? submitButton.querySelector('.jb-add-to-cart__text') : null;
    const soldOutMessage = submitButton ? submitButton.querySelector('.sold-out-message') : null;
    const samplePriceText = priceEl ? priceEl.textContent.trim() : '$0.00';

    const selectedOptions = optionGroups.map((group) => {
      const active = group.querySelector('.jb-option-btn.active');
      return active ? active.dataset.value : group.querySelector('.jb-option-btn').dataset.value;
    });

    function findVariant(options) {
      return variants.find((variant) => options.every((value, i) => variant.options[i] === value));
    }

    function updateUI(variant) {
      if (!idInput) return;

      if (variant) {
        idInput.value = variant.id;
        idInput.disabled = false;

        if (priceEl) priceEl.textContent = moneyFormat(variant.price, samplePriceText);

        if (submitButton) {
          const available = variant.available;
          submitButton.disabled = !available;
          submitButton.setAttribute('aria-disabled', available ? 'false' : 'true');
          if (submitText) {
            submitText.classList.toggle('hidden', !available);
            if (available) submitText.textContent = `ADD TO BAG — ${moneyFormat(variant.price, samplePriceText)}`;
          }
          if (soldOutMessage) soldOutMessage.classList.toggle('hidden', available);
        }
      } else {
        idInput.disabled = true;
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('aria-disabled', 'true');
          if (submitText) submitText.classList.add('hidden');
          if (soldOutMessage) soldOutMessage.classList.remove('hidden');
        }
      }

      form.dispatchEvent(
        new CustomEvent('lma:variant:change', { bubbles: true, detail: { variant, sectionId } })
      );
    }

    optionGroups.forEach((group, index) => {
      group.addEventListener('click', (event) => {
        const button = event.target.closest('.jb-option-btn');
        if (!button || !group.contains(button)) return;

        group.querySelectorAll('.jb-option-btn').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        const labelSpan = group.querySelector('.jb-option-selected');
        if (labelSpan) labelSpan.textContent = button.dataset.value;

        selectedOptions[index] = button.dataset.value;
        updateUI(findVariant(selectedOptions));
      });
    });

    updateUI(findVariant(selectedOptions));
  }

  function init() {
    document.querySelectorAll('.jb-product-form-wrapper').forEach(initProduct);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
