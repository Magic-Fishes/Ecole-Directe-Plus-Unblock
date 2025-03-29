const fs = require("fs");
const path = require("path");

const supportedBrowsers = ["chromium", "firefox"];

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
      console.error(
        `Specified browser unsupported | Supported: ${supportedBrowsers.join(
          ", "
        )}`
      );
      process.exit(1);
  }

  // Load common and browser specific manifest
  const commonManifest = JSON.parse(
    fs.readFileSync("manifest.common.json", "utf8")
  );
  const browserManifest = JSON.parse(
    fs.readFileSync(browserManifestFileName, "utf8")
  );

  // Merge both manifest, giving priority to the browser specific manifest
  const mergedManifest = { ...commonManifest, ...browserManifest };

  // `dist/${browser}/manifest.${browser}.output.json`
  fs.writeFileSync(
    `dist/${browser}/manifest.json`,
    JSON.stringify(mergedManifest, null, 2)
  );

  console.log(`${browser} manifest successfully created`);
}

async function copyDir(src, dest, browser) {
  async function shouldCopyFile(fileName, browser) {
    const blacklist = ["build.js", "README.md"];
    for (let supportedBrowser of supportedBrowsers) {
      if (supportedBrowser !== browser) {
        if (
          fileName.split(".").includes(supportedBrowser) ||
          fileName.includes("manifest") ||
          blacklist.includes(fileName)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function isDangerousSubdirectory(src, dest) {
    const normalizedSrcPath = src.replace(/\\/g, "/");
    const normalizedDestPath = dest.replace(/\\/g, "/");
    const directoryOccurencies = normalizedDestPath
      .split("/")
      .filter((directory) =>
        normalizedSrcPath.split("/")[0].includes(directory)
      ).length;
    return directoryOccurencies > 1;
  }

  if (isDangerousSubdirectory(src, dest)) {
    console.log(`Prevent recursive bomb by ignoring: ${src} -> ${dest}`);
    return;
  }

  try {
    await fs.promises.mkdir(dest, { recursive: true });

    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory() && entry.name.startsWith(".")) {
        console.log(`Ignored hidden folder: ${entry.name}`);
        continue;
      }

      if (entry.isFile() && entry.name.startsWith(".")) {
        console.log(`Ignored hidden file: ${entry.name}`);
        continue;
      }

      if (entry.isFile() && !shouldCopyFile(entry.name, browser)) {
        console.log(`Ignored browser specific file: ${entry.name}`);
        continue;
      }

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath, browser);
      } else {
        try {
          await fs.promises.copyFile(srcPath, destPath);
          console.log(`File copied: ${srcPath} -> ${destPath}`);
        } catch (err) {
          console.error(`Error while copying the file ${srcPath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error(`Error while processing directory ${src}:`, err);
  }
}

// check the target browser
if (process.argv.length < 3) {
  console.error("Usage: node build.js <browser>");
  process.exit(1);
}

const browser = process.argv[2].toLowerCase();

async function build(browser) {
  // ensure the folders are created
  fs.mkdirSync("dist", { recursive: true });
  for (let supportedBrowser of supportedBrowsers) {
    fs.mkdirSync(`dist/${supportedBrowser}`, { recursive: true });
  }

  mergeManifest(browser);
  await copyDir(".", `dist/${browser}`, browser);
  console.log(`\x1b[32m${browser} extension successfully built\x1b[0m`);
}

build(browser);

if (process.argv[3] == "--watch") {
  fs.watch(".", { recursive: true }, (eventType, filename) => {
    try {
      if (filename.includes("dist")) return;
      console.log(
        `File ${filename} changed, rebuilding ${browser} extension...`
      );
      build(browser);
    } catch (e) {}
  });
}
