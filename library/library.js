(() => {
  const form = document.querySelector('#library-filters');
  if (form) {
    const fields = ['search', 'category', 'kind', 'runtime'].map(id => document.getElementById(id));
    const cards = [...document.querySelectorAll('.library-card')];
    const reset = document.getElementById('reset-filters');
    const apply = (save = true) => {
      const [query, category, kind, runtime] = fields.map(el => el.value.trim().toLowerCase());
      const words = query.split(/\s+/).filter(Boolean);
      let count = 0;
      for (const card of cards) {
        card.hidden = !((!category || card.dataset.category === category) && (!kind || card.dataset.kind === kind) && (!runtime || card.dataset.runtime === runtime) && words.every(word => card.dataset.search.includes(word)));
        if (!card.hidden) count++;
      }
      document.getElementById('result-count').textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
      document.getElementById('empty-state').hidden = count > 0;
      reset.hidden = !fields.some(el => el.value);
      if (save) {
        const url = new URL(location.href);
        fields.forEach(el => el.value ? url.searchParams.set(el.name, el.value) : url.searchParams.delete(el.name));
        history.replaceState(null, '', url);
      }
    };
    const restore = () => {
      const params = new URLSearchParams(location.search);
      fields.forEach(el => { el.value = params.get(el.name) || ''; });
      apply(false);
    };
    form.hidden = false;
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', () => apply());
    form.addEventListener('change', () => apply());
    reset.addEventListener('click', () => { form.reset(); apply(); fields[0].focus(); });
    window.addEventListener('popstate', restore);
    restore();
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const code = button.parentElement.querySelector('code');
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied!';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code); selection.removeAllRanges(); selection.addRange(range);
        button.textContent = 'Select & copy';
      }
      setTimeout(() => { button.textContent = 'Copy'; }, 2200);
    });
  });
})();
