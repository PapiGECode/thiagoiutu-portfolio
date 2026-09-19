(() => {
  const html = document.documentElement;
  const theme = document.getElementById("theme-toggle");
  function syncTheme() {
    const light = html.classList.contains("light");
    theme.setAttribute("aria-label", light ? "Activar tema oscuro" : "Activar tema claro");
    theme.setAttribute("aria-pressed", String(light));
  }
  syncTheme();
  theme.addEventListener("click", () => {
    const light = html.classList.toggle("light");
    try { localStorage.setItem("ak-theme", light ? "light" : "dark"); } catch(e) {}
    syncTheme();
  });
  const photos = [...document.querySelectorAll("[data-photo]")];
  let galleryPhotos = photos;
  const dialog = document.getElementById("photo-dialog");
  const full = document.getElementById("photo-full");
  const caption = document.getElementById("photo-caption");
  const count = document.getElementById("photo-count");
  const cursor = document.getElementById("cur");
  let current = 0, opener;
  function show(index) {
    current = (index + galleryPhotos.length) % galleryPhotos.length;
    const image = galleryPhotos[current].querySelector("img");
    full.src = image.src; full.alt = image.alt;
    caption.textContent = image.alt;
    count.textContent = String(current + 1).padStart(2,"0") + " / " + String(galleryPhotos.length).padStart(2,"0");
    const singlePhoto = galleryPhotos.length < 2;
    document.getElementById("photo-prev").hidden = singlePhoto;
    document.getElementById("photo-next").hidden = singlePhoto;
  }
  photos.forEach(button => button.addEventListener("click", () => {
    const group = button.dataset.gallery;
    galleryPhotos = photos.filter(photo => photo.dataset.gallery === group);
    opener = button; show(galleryPhotos.indexOf(button)); dialog.showModal(); dialog.append(cursor);
    document.getElementById("photo-close").focus();
  }));
  document.getElementById("photo-close").addEventListener("click", () => dialog.close());
  document.getElementById("photo-prev").addEventListener("click", () => show(current - 1));
  document.getElementById("photo-next").addEventListener("click", () => show(current + 1));
  dialog.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });
  dialog.addEventListener("click", e => { if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  }});
  dialog.addEventListener("close", () => { document.body.append(cursor); opener?.focus(); });
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const ring = document.getElementById("cur-ring"), dot = document.getElementById("cur-dot");
  let x = innerWidth/2, y = innerHeight/2, rx=x, ry=y;
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  addEventListener("mousemove", e => {
    x=e.clientX; y=e.clientY;
    dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    html.classList.add("fine"); cursor.style.opacity="1";
  }, {passive:true});
  html.addEventListener("mouseleave", () => cursor.style.opacity="0");
  function draw() {
    rx+=(x-rx)*(reduce?1:.18); ry+=(y-ry)*(reduce?1:.18);
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(draw);
  }
  draw();
  document.querySelectorAll("a,button").forEach(el => {
    el.addEventListener("mouseenter", () => html.classList.add("cur-hot"));
    el.addEventListener("mouseleave", () => html.classList.remove("cur-hot"));
  });
})();
