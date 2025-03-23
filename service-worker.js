chrome.declarativeNetRequest.updateEnabledRulesets(
	{ enableRulesetIds: ["change_origin"] }
)

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ["content-scripts/DOMInjectionBridge.js"]
		});
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "GET_EXTENSION_INFO") {
		const extensionInfo = {
			name: chrome.runtime.getManifest().name,
			version: chrome.runtime.getManifest().version
		};
		sendResponse(extensionInfo);
	}
	return true;
});

async function updateGtkRules(gtk) {
	const removeRuleIds = await chrome.declarativeNetRequest.getDynamicRules()
		.then(rules => rules.map(rule => rule.id));

	const rules = [];

	rules.push({
		id: 10,
		priority: 1,
		condition: {
			urlFilter: "||ecoledirecte.com",
			resourceTypes: ["xmlhttprequest", "main_frame", "sub_frame"],
			excludedInitiatorDomains: ["www.ecoledirecte.com", "ecoledirecte.com"]
		},
		action: {
			type: "modifyHeaders",
			requestHeaders: [
				{
					header: "X-GTK",
					operation: "set",
					value: gtk
				},
				{
					header: "Cookie",
					operation: "set",
					value: `GTK=${gtk}`
				},
			]
		},
	});

	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: removeRuleIds,
		addRules: rules
	});

	chrome.tabs.query({ url: ["https://*.ecole-directe.plus/*"] }, (tabs) => {
		console.log(tabs);
		tabs.forEach(tab => {
			chrome.tabs.sendMessage(tab.id, {
				action: "gtkRulesUpdated"
			})
		});
	});
}

function interceptCookieGTK(details) {
	const url = new URL(details.url);
	const queryParams = new URLSearchParams(url.search);
	if (queryParams.get("gtk") !== "1") return;

	const headers = details.responseHeaders;
	for (const { name, value } of headers) {
		if (name !== "set-cookie") continue;
		if (!value.startsWith("GTK")) return;

		const parts = value.split(";")[0];
		const cookie = parts.split("=")[1];
		if (cookie) {
			updateGtkRules(cookie);
		}
	}

	return { responseHeaders: headers };
}

function getBrowser() {
	if (typeof chrome !== "undefined") {
		if (typeof browser !== "undefined") {
			return "Firefox";
		} else {
			return "Chrome";
		}
	} else {
		return "Edge";
	}
}

chrome.webRequest.onHeadersReceived.addListener(
	interceptCookieGTK,
	{ urls: ["*://api.ecoledirecte.com/v3/login.awp*"] },
	getBrowser() === "Firefox" ? ["responseHeaders"] : ["responseHeaders", "extraHeaders"]
);
