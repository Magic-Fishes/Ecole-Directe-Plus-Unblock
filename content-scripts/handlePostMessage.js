console.log("handlePostMessage Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (sender.id === chrome.runtime.id) {
		window.postMessage({
			type: "EDPU_MESSAGE",
			payload: message
		}, "*");
	}
});
