const injectEDPStyles = (isInvalid) => {
  document.documentElement.classList.add("edp");
  const isWhite = (value) => value > 70 && value < 256;
  const isBlack = (value) => value > 0 && value < 70;
  document
    .querySelectorAll("body > *:not(script)")
    .forEach((e) => (e.style.display = "none"));
  document.head.querySelectorAll("style").forEach((e) => e.remove());
  document.head.querySelectorAll("link").forEach((e) => {
    if (e.getAttribute("rel").includes("icon")) {
      e.remove();
    }
  });
  const page = document.createElement("main");
  const content = `
    <span class="back-arrow">
      <a href="https://ecole-directe.plus/#home" title="Retour à la page d'accueil">
        <svg class="go-back-arrow" id="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" tabindex="0" height="50px"><path d="M69.5866 90L162 90C167.523 90 172 94.4772 172 100C172 105.523 167.523 110 162 110L69.5866 110C68.6726 110 68.2376 111.125 68.9139 111.74L92.8394 133.49C96.7818 137.074 97.0405 143.187 93.4151 147.091C89.8561 150.924 83.8801 151.192 79.9924 147.693L33.6071 105.946C30.076 102.768 30.076 97.2316 33.6071 94.0536L79.9924 52.3068C83.8801 48.8079 89.8561 49.0758 93.4151 52.9086C97.0405 56.8129 96.7818 62.9256 92.8394 66.5096L68.9139 88.2601C68.2376 88.8749 68.6726 90 69.5866 90Z" fill="#FFF"></path></svg>
      </a>
    </span>
      <header>
      <section id="form-container">
      ${
        isInvalid
          ? '<div id="invalid">Adresse mail, numéro de téléphone ou captcha invalide</div>'
          : ""
      }
      <form>
        <h1>Réinitialisation de votre mot de passe</h1>
        <div class="text-input-container ">
          <input class="text-input" type="text" placeholder="Adresse email ou numéro de téléphone" required="" autocomplete="username" value="">
        </div>
        <div id="image-container">
          <img id="captcha" src="" alt="Captcha">
          <button id="refresh" type="button">Rafraichir</button>
        </div>
        <div class="text-input-container">
          <input type="text" id="captcha" placeholder="Captcha" required>
        </div>
        <button type="submit">Envoyer</button>
      </form>
      </section>
    </header>
  `;
  page.innerHTML = content;
  page.id = "main";
  document.body.appendChild(page);

  const EDPifyCaptcha = (url) => {
    const img = new Image();
    img.src = url || "";
    const c = document.createElement("canvas");
    const w = img.width,
      h = img.height;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    let pixel = imageData.data;
    let r = 0,
      g = 1,
      b = 2;
    for (let p = 0; p < pixel.length; p += 4) {
      if (
        isWhite(pixel[p + r]) &&
        isWhite(pixel[p + g]) &&
        isWhite(pixel[p + b])
      ) {
        pixel[p + r] = 50;
        pixel[p + g] = 50;
        pixel[p + b] = 87;
      } else if (
        isBlack(pixel[p + r]) &&
        isBlack(pixel[p + g]) &&
        isBlack(pixel[p + b])
      ) {
        pixel[p + r] = 255;
        pixel[p + g] = 255;
        pixel[p + b] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    c.toBlob((e) => {
      document.querySelector("#captcha").src = URL.createObjectURL(e);
    }, "image/png");
    c.remove();
  };
  EDPifyCaptcha(document.querySelector("#A7").src);
  document.querySelector("button#refresh").addEventListener("click", () => {
    document.querySelector("#A8").click();
    EDPifyCaptcha(document.querySelector("#A7").src);
  });
};

if (new URL(document.referrer).hostname.includes("ecole-directe.plus")) {
  sessionStorage.setItem("isFromEDP", true); // une value pour check si on vient d'EDP prcq si on clique sur étape suivante et qu'on a pas mis les bonnes infos ça refresh et le referrer c'est plus ecole-directe.plus
  injectEDPStyles();
} else if (
  new URL(document.referrer).pathname === "/mot-de-passe-oublie.awp" &&
  sessionStorage.getItem("isFromEDP")
) {
  injectEDPStyles(true);
}
