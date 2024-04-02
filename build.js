
const fs = require("fs");
const path = require("path");

const supportedBrowsers = ["chromium", "firefox"]

function mergeManifest(browser) {
    let browserManifestFileName;

    switch (browser) {
        case "chromium":
            browserManifestFileName = "manifest.chromium.json";
            break;
        case "firefox":
            browserManifestFileName = "manifest.firefox.json";
            break;
        default:
            console.error(`Specified browser unsupported | Supported: ${supportedBrowsers.join(", ")}`);
            process.exit(1);
    }

    // Load common and browser specific manifest
    const commonManifest = JSON.parse(fs.readFileSync("manifest.common.json", "utf8"));
    const browserManifest = JSON.parse(fs.readFileSync(browserManifestFileName, "utf8"));

    // Merge both manifest, giving priority to the browser specific manifest
    const mergedManifest = { ...commonManifest, ...browserManifest };

    // `dist/${browser}/manifest.${browser}.output.json`
    fs.writeFileSync(`dist/${browser}/manifest.json`, JSON.stringify(mergedManifest, null, 2));

    console.log(`${browser} manifest successfully created`);
}


function copyDir(src, dest, browser) {
    function shouldCopyFile(fileName, browser) {
        const blacklist = ["build.js", "README.md"]
        for (let supportedBrowser of supportedBrowsers) {
            if (supportedBrowser !== browser) {
                if (fileName.split(".").includes(supportedBrowser) || fileName.includes("manifest") || blacklist.includes(fileName)) {
                    return false
                }
            }
        }

        return true
    }

    function isDangerousSubdirectory(src, dest) {
        const normalizedSrcPath = src.replace(/\\/g, '/');
        const normalizedDestPath = dest.replace(/\\/g, '/');
        const directoryOccurencies = normalizedDestPath.split("/").filter(directory => normalizedSrcPath.split("/")[0].includes(directory)).length;
        // console.log("src:", src)
        // console.log("dest:", dest)
        // console.log("isDangerousSubdirectory ~ directoryOccurencies:", directoryOccurencies)
        return directoryOccurencies > 1;
    }

    if (isDangerousSubdirectory(src, dest)) {
        console.log(`Prevent recursive bomb by ignoring: ${src} -> ${dest}`);
        return;
    }

    fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error while creating the folder ${dest}:`, err);
            return;
        }

        fs.readdir(src, { withFileTypes: true }, (err, entries) => {
            if (err) {
                console.error(`Error while reading the folder ${src}:`, err);
                return;
            }

            entries.forEach((entry) => {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);

                if (entry.isDirectory() && entry.name.startsWith('.')) {
                    console.log(`Ignored hidden folder: ${entry.name}`);
                    return;
                }

                if (entry.isFile() && entry.name.startsWith('.')) {
                    console.log(`Ignored hidden file: ${entry.name}`);
                    return;
                }

                if (entry.isFile() && !shouldCopyFile(entry.name, browser)) {
                    console.log(`Ignored browser specific file: ${entry.name}`);
                    return;
                }

                if (entry.isDirectory()) {
                    copyDir(srcPath, destPath);
                } else {
                    fs.copyFile(srcPath, destPath, (err) => {
                        if (err) {
                            console.error(`Error while copying the file ${srcPath}:`, err);
                        } else {
                            console.log(`File copied: ${srcPath} -> ${destPath}`);
                        }
                    });
                }
            });
        });
    });
}


// check the target browser
if (process.argv.length < 3) {
    console.error("Usage: node build.js <browser>");
    process.exit(1);
}

const browser = process.argv[2].toLowerCase();

async function build(browser) {
    // ensure the folders are created
    await fs.mkdir("dist", { recursive: true }, () => { })
    for (let supportedBrowser of supportedBrowsers) {
        await fs.mkdir(`dist/${supportedBrowser}`, { recursive: true }, () => { });
    }

    mergeManifest(browser);
    copyDir(".", `dist/${browser}`, browser)
    setTimeout(() => console.log(`${browser} extension successfully built`), 100); // currently broken
}

build(browser);

