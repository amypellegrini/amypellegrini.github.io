(() => {
  const key = "color-theme";
  const normalize = (value) =>
    value === "light" || value === "dark" ? value : "system";
  let preference = "system";

  const apply = (value) => {
    preference = normalize(value);
    if (preference === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", preference);
    }
  };

  // Apply before styles load to avoid a flash of the wrong theme.
  try {
    preference = normalize(localStorage.getItem(key));
  } catch {
    // System styling still works when browser storage is unavailable.
  }
  apply(preference);

  document.addEventListener("DOMContentLoaded", () => {
    const control = document.querySelector(".theme-control");
    const radios = control.querySelectorAll('input[name="theme"]');
    const syncControl = () => {
      radios.forEach((radio) => { radio.checked = radio.value === preference; });
    };
    syncControl();
    control.hidden = false;
    control.addEventListener("change", (event) => {
      if (!event.target.matches('input[name="theme"]')) return;
      apply(event.target.value);
      syncControl();
      try {
        if (preference === "system") localStorage.removeItem(key);
        else localStorage.setItem(key, preference);
      } catch {
        // The selection remains usable for this page without storage.
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.storageArea === localStorage && (event.key === key || event.key === null)) {
        apply(event.newValue);
        syncControl();
      }
    });
  });
})();
