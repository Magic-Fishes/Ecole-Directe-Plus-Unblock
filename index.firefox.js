console.log("Service Worker v0.2 => ON")

function changeHeaders(requestDetails) {
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
    changeHeaders,
    { urls: ["*://*.ecoledirecte.com/*"] },
    ["blocking", "requestHeaders"]
);
