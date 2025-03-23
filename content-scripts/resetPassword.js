const injectEDPStyles = () => {
	document.documentElement.classList.add("edp");
	const img = document.querySelector("#A7");
	const isWhite = (value) => value > 50 && value < 256;
	const isBlack = (value) => value > 0 && value < 50;
	document.querySelector(
		"div.pos2 > div.pos3 > table > tbody > tr > td > h1"
	).textContent = "Ecole Directe Plus";
	document.querySelector("#A2").src =
		"https://ecole-directe.plus/images/EDP-logo-black.svg";
	document.querySelector("h3.panel-title").textContent =
		document.querySelector("h3.panel-title").textContent.charAt(0) +
		document
			.querySelector("h3.panel-title")
			.textContent.substring(1)
			.toLowerCase();
	document.querySelector('a').href = 'https://ecole-directe.plus/#home';
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
			pixel[p + r] = 24;
			pixel[p + g] = 24;
			pixel[p + b] = 41;
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
		document.querySelector("#A7").src = URL.createObjectURL(e);
	}, "image/png");
	document.querySelector("button#A8").innerHTML =
		'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M5.516 14.224c-2.262-2.432-2.222-6.244.128-8.611a6.07 6.07 0 0 1 3.414-1.736L8.989 1.8a8.1 8.1 0 0 0-4.797 2.351c-3.149 3.17-3.187 8.289-.123 11.531l-1.741 1.752 5.51.301-.015-5.834zm6.647-11.959.015 5.834 2.307-2.322c2.262 2.434 2.222 6.246-.128 8.611a6.07 6.07 0 0 1-3.414 1.736l.069 2.076a8.12 8.12 0 0 0 4.798-2.35c3.148-3.172 3.186-8.291.122-11.531l1.741-1.754z"/></svg>';
}

if (new URL(document.referrer).hostname.includes("ecole-directe.plus")) {
	injectEDPStyles();
}