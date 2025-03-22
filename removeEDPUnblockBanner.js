
setTimeout(() => {
    chrome.runtime.sendMessage({type: 'GET_EXTENSION_INFO'}, (response) => {
        if (response) {
            const message = {
                type: "EDP_UNBLOCK",
                payload: {
                    message: "EXTENSION_INSTALLED",
                    version: response.version
                }
            }

            window.postMessage(message, "*");
        }
    });
}, 500);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "gtkRulesUpdated") {
    window.postMessage({
      type: "FROM_EXTENSION",
      action: "gtkRulesUpdated",
      gtk: message.gtk
    }, "*");
  }
});
