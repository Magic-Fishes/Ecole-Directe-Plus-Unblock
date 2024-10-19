console.log("Service Worker => ON")
chrome.declarativeNetRequest.updateEnabledRulesets(
    { enableRulesetIds: ["change_origin"] }
)

try {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["DOMInjectionBridge.js"]
            });
        }
    });
} catch(e) {
    console.log("e", e)
}

try {
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
} catch(e) {
    console.log("e", e)
}
