console.log("Service Worker v0.2 => ON")

function spoofHeaders(requestDetails) {
    let headers = requestDetails.requestHeaders;

    console.log("spoofing headers...", requestDetails.url)

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
    spoofHeaders,
    { urls: ["*://*.ecoledirecte.com/*"] },
    ["blocking", "requestHeaders"]
);
