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

let gtk = null;

async function updateGtkRules() {
  const removeRuleIds = await chrome.declarativeNetRequest.getDynamicRules()
    .then(rules => rules.map(rule => rule.id));

  const rules = [];

  if (gtk) {
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
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: removeRuleIds,
    addRules: rules
  });

  chrome.tabs.query({url: "*://*.ecole-directe.plus/*"}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: "gtkRulesUpdated"
      });
    });
  });
}

function interceptCookieGTK(details) {
  let headers = details.responseHeaders;

  for (const { name, value } of headers) {
    if (name !== "set-cookie") continue;
    if (!value.startsWith("GTK")) return;

    const parts = value.split(";")[0];
    const cookie = parts.split("=")[1];
    if (cookie) {
      gtk = cookie;
      updateGtkRules();
    }
  }

  return { responseHeaders: headers };
}

chrome.webRequest.onHeadersReceived.addListener(
  interceptCookieGTK,
  { urls: ["*://api.ecoledirecte.com/*"] },
  ["responseHeaders", "extraHeaders"]
);
