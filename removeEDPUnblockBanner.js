
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