
const api = typeof browser === "undefined" ? chrome : browser;

const allowedDomains = ["ecole-directe.plus", "ecoledirecte.com"];

async function getActiveTabDomain() {
    let domain;
    await api.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        let url = new URL(tabs[0].url);
        domain = url.hostname;
    }).catch((error) => {
        console.error("Error while getting the active tab: ", error);
    });

    return domain;
}

function insertStatus(active = false) {
    const status = document.getElementById("edp-unblock-status");
    const statusText = document.createElement("p");
    statusText.id = "status-text";
    statusText.innerText = active ? "Extension active" : "Extension inactive";
    statusText.className = active ? "active" : "inactive";
    const statusIMG = document.createElement("img");
    statusIMG.id = "status-img";
    statusIMG.src = "images/" + (active ? "active.svg" : "inactive.svg");
    statusIMG.className = active ? "active" : "inactive";
    status.appendChild(statusIMG);
    status.appendChild(statusText);
}

async function updateExtensionStatus() {
    const activeDomain = await getActiveTabDomain();
    console.log("activeDomain:", activeDomain)
    if (!activeDomain) {
        return;
    }
    
    let isActive = false;
    for (let allowedDomain of allowedDomains) {
        if (activeDomain.endsWith(allowedDomain)) {
            isActive = true;
            break;
        }
    }

    console.log("isActive:", isActive);
    insertStatus(isActive)
}

updateExtensionStatus();
