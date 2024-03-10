console.log("Service Worker => ON")
chrome.declarativeNetRequest.updateEnabledRulesets(
    {enableRulesetIds: ["change_origin"]}
).then((answer) => {
    chrome.declarativeNetRequest.getEnabledRulesets().then(console.log)
})