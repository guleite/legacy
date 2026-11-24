/* Globo interativo (cobe) com as praças onde a Legacy atua.
   Se a biblioteca não carregar, fica o globo pontilhado em CSS. */
const wrap = document.querySelector(".globe");
const cv = wrap?.querySelector("canvas");

if (cv) {
  import("https://cdn.jsdelivr.net/npm/cobe@0.6.3/+esm").then(({ default: createGlobe }) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const places = [
      [25.76, -80.19],  // Miami
      [40.71, -74.0],   // Nova York
      [38.72, -9.14],   // Lisboa
      [51.51, -0.13],   // Londres
      [47.37, 8.54],    // Zurique
      [49.61, 6.13],    // Luxemburgo
      [25.2, 55.27],    // Dubai
      [1.35, 103.82],   // Singapura
    ];
    const home = [[-15.79, -47.88], [-23.55, -46.63]]; // Brasília, São Paulo
    const markers = [
      ...places.map((location) => ({ location, size: 0.045 })),
      ...home.map((location) => ({ location, size: 0.07 })),
    ];

    let width = cv.offsetWidth;
    let phi = 5.3;          // começa mostrando o Atlântico (Brasil ↔ EUA/Europa)
    let drag = null, dragOff = 0, r = 0;
    const onResize = () => (width = cv.offsetWidth);
    addEventListener("resize", onResize);

    const globe = createGlobe(cv, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.3,
      mapSamples: 20000,
      mapBrightness: 5.2,
      baseColor: [0.2, 0.3, 0.62],
      markerColor: [0.72, 0.83, 1],
      glowColor: [0.14, 0.24, 0.55],
      markers,
      onRender: (state) => {
        if (drag === null && !reduce) phi += 0.0026;
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    cv.addEventListener("pointerdown", (e) => { drag = e.clientX - dragOff; cv.setPointerCapture?.(e.pointerId); });
    const stop = () => { drag = null; };
    cv.addEventListener("pointerup", stop);
    cv.addEventListener("pointerout", stop);
    cv.addEventListener("pointermove", (e) => {
      if (drag === null) return;
      dragOff = e.clientX - drag;
      r = dragOff / 220;
    });

    setTimeout(() => { cv.classList.add("is-on"); wrap.classList.add("has-cobe"); }, 120);
    window.addEventListener("pagehide", () => globe.destroy?.());
  }).catch(() => { /* mantém o fallback em CSS */ });
}
