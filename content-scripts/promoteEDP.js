const delay = ms => new Promise(res => setTimeout(res, ms));

/* Code from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists#answer-61511955 */
function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

async function loadAds(path) {
	if (path === "/login") {
		let adLoginHTML = `
            <div style="font-size: 20px; font-weight: 300; color: #fff;">
                Vous cherchez EcoleDirecte, mais en mieux ? Jetez un coup d'oeil à Ecole Directe Plus !
                <br>
                <br>
                <div style="font-size: 13px;background: rgb(255, 255, 255, .1); color: whtie; border: 1px solid rgb(255, 255, 255, .2); border-radius: 15px; width: max-content; padding: 5px 10px; margin: 0 auto; display: flex; align-items: center;  flex-flow: row nowrap;  gap: 8px;" class="affiliation-disclaimer">
                <svg height="13" style="transform: scale(1.7)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.5V7.5M12 17L12 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                Service open source non-affilié à Aplim</div>
                <br>
                <a href="https://ecole-directe.plus/">
                    <img style="border-radius: 10px;" src="data:image/png;base64,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" alt="Ecole Directe Plus" />
                </a>
                <br><br><br>
            </div>`;
		if (document.getElementsByClassName('autopromo')[0]) {
			document.querySelector(".autopromo > p").style.textAlign = "center";
			document.getElementsByClassName('autopromo')[0].insertAdjacentHTML('afterbegin', adLoginHTML);
		}
	} else if (path.startsWith('/Eleves/') && localStorage.bigAds === "true") {
		injectAd();
	}
}

function injectAd() {
	let adHomeHTML = `
        <div class="item-postit col-lg-4 ng-star-inserted" id="EDPAd">
            <span class="epingle" style="background-color: #e4e4ff;"></span>
            <div class="note-postit gestion-postit" style="background-color: #d2d2ff;">
                <button id="closeAdBtn" style="position: absolute; top: 27px; right: 25px; background-color: transparent; border: none; font-size: 16px; color: #000; cursor: pointer;">✖</button>
                <div class="clearfix"></div>
                <p class="ed-cke">
                <span style="position: absolute; color: #fff; top: 65px; right: 43px; z-index: 1; user-select: none; font-weight: bold;">Publicité</span>
                <div style="padding-bottom: 56.25%; max-width: 100%; position: relative; pointer-events: none;"><iframe src="https://www.youtube.com/embed/E3mhS5UPNYk?start=1&autoplay=1&loop=1&mute=1&rel=0&iv_load_policy=3&controls=0&disablekb=1&fs=0&playlist=E3mhS5UPNYk" width="800" height="450" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" frameborder="0"></iframe></div>
                <span style="color: #fff; position: relative; z-index: 10; user-select: none; font-weight: bold; text-align: center; margin-top: -20px; display: block;">Site internet non affilié</span>
                <span style="display: block; margin-top: 5px; text-align: center; color: #15141A; z-index: 1; user-select: none; font-weight: bold; width: 100%;">Ecole Directe Plus n'est affilié ni à EcoleDirecte ni à la société Aplim.</span>
                <div class="clearfix"></div>
                <span class="clearfix"></span>
            </div>
        </div>`;

	waitForElm('div.liste-postit.row').then(() => {
		document.querySelector("div.liste-postit.row").insertAdjacentHTML('afterbegin', adHomeHTML);

		// Add event listener to close button
		document.getElementById('closeAdBtn').addEventListener('click', function () {
			document.getElementById('EDPAd').style.display = 'none';
			localStorage.setItem('bigAds', 'false');
		});
	});
}

document.addEventListener("load", loadAds(location.pathname));

(function (history) {
	var pushState = history.pushState;
	history.pushState = async function (state) {
		pushState.apply(history, arguments);
		await delay(50);
		loadAds(location.pathname)
	};
})(window.history);

if (!localStorage.getItem('bigAds')) {
	localStorage.setItem('bigAds', 'true'); // Set bigAds to true by default
}

// Listen for changes in the URL path to detect when the user logs in
let previousPath = location.pathname;
setInterval(() => {
	if (location.pathname !== previousPath) {
		previousPath = location.pathname;
		loadAds(location.pathname);
	}
}, 100);