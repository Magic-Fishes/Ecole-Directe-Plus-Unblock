console.log("handlePostMessage Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "gtkRulesUpdated") {
		window.postMessage({
			type: "EDPU_MESSAGE",
			payload: message
		}, "*");
	}
});
