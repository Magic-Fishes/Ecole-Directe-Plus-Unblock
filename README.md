# Ecole Directe Plus Browser Extension

| Chrome | Firefox |
|---|---|
| <a href="https://chrome.google.com/webstore/detail/hoppscotch-browser-extens/amknoiejhlmhancpahfcfcfhllgkpbld"><picture><source media="(prefers-color-scheme: dark)" srcset="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/chrome-badge-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/chrome-badge-light.svg"><img alt="Firefox" src="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/chrome-badge-light.svg"></picture></a> | <a href="https://addons.mozilla.org/en-US/firefox/addon/hoppscotch/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/firefox-badge-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/firefox-badge-light.svg"><img alt="Firefox" src="https://gist.githubusercontent.com/liyasthomas/f65059863bfd701559aebe3257ec9cc8/raw/54d5c1457fd54f15f968b39bdf2aba1c4f8b452b/firefox-badge-light.svg"></picture></a> |

[Ecole Directe Plus](https://github.com/Magic-Fishes/Ecole-Directe-Plus) is a community-driven end-to-end open-source API development ecosystem.


> [!IMPORTANT]  
> Ecole Directe Plus extension only works for the [Ecole Directe Plus](https://ecole-directe.plus) website! If you want to use the extension anywhere outside [the official Ecole Directe Plus instance](https://ecole-directe.plus) you may want to fork the extension and edit by yourself or install the [CORS Unblock extension](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino).


**Haven't tried Ecole Directe Plus yet? Try it at [ecole-directe.plus](https://ecole-directe.plus)**

This extension provides the following features to Ecole Directe Plus:

- [x] Overrides `CORS` restrictions for cross-origin requests (it allows requests against localhost).

### Development
We use [pnpm](https://pnpm.io) as our package manager. Please install it before proceeding.

- Clone the repo
- Run `pnpm install`
- Run `pnpm run build:chrome` or `pnpm run build:firefox` depending on your browser to generate the *dist* folder
- Install the extension using your browser's install options (a quick Google search will yield the methods)
