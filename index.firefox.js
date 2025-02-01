console.log("Service Worker v0.2 => ON")

function changeRequestHeaders(requestDetails) {
    let headers = requestDetails.requestHeaders;

    for (let header of headers) {
        if (header.name.toLowerCase() === "referer") {
            header.value = "https://www.ecoledirecte.com";
        } else if (header.name.toLowerCase() === "origin") {
            header.value = "https://www.ecoledirecte.com";
        }
    }

    return { requestHeaders: headers };
}

browser.webRequest.onBeforeSendHeaders.addListener(
    changeRequestHeaders,
    { urls: ["*://*.ecoledirecte.com/*"] },
    ["blocking", "requestHeaders"]
);

function changeResponseHeaders(requestDetails) {
    let headers = requestDetails.responseHeaders;

    for (let header of headers) {
        if (header.name.toLowerCase() === "access-control-allow-origin") {
            header.value = "*";
        }
    }
    
    return { responseHeaders: headers };
}


browser.webRequest.onHeadersReceived.addListener(
    changeResponseHeaders,
    { urls: ["*://*.ecoledirecte.com/*"] },
    ["blocking", "responseHeaders"]
);
