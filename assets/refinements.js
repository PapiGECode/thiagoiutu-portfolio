(() => {
  const menu = document.getElementById("nav-overlay");
  const burger = document.getElementById("nav-burger");
  if (menu && burger) {
    menu.inert = !menu.classList.contains("open");
    const sync = () => {
      const open = menu.classList.contains("open");
      menu.inert = !open;
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (open) menu.querySelector("a")?.focus();
    };
    new MutationObserver(sync).observe(menu, {attributes:true, attributeFilter:["class"]});
    const desktop = matchMedia("(min-width: 1051px)");
    const closeMenu = () => {
      if (menu.classList.contains("open")) burger.click();
    };
    desktop.addEventListener("change", e => {
      if (e.matches) {
        closeMenu();
        if (document.activeElement === burger || menu.contains(document.activeElement)) {
          document.getElementById("logo").focus();
        }
      }
    });
    // Back/forward cache can restore a page with its mobile menu still open.
    addEventListener("pageshow", e => { if (e.persisted) closeMenu(); });
    document.addEventListener("keydown", e => {
      if (!menu.classList.contains("open")) return;
      if (e.key === "Escape") { burger.click(); burger.focus(); }
      if (e.key === "Tab") {
        const elements = [burger, ...menu.querySelectorAll("a")];
        const current = elements.indexOf(document.activeElement);
        e.preventDefault();
        elements[(current + (e.shiftKey ? -1 : 1) + elements.length) % elements.length].focus();
      }
    });
  }
  const cursor = document.getElementById("cur");
  if (cursor) {
    cursor.style.opacity = "0";
    document.addEventListener("mousemove", () => cursor.style.opacity = "1", {passive:true});
    document.documentElement.addEventListener("mouseleave", () => cursor.style.opacity = "0");
  }
})();
