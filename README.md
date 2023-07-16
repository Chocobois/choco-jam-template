# Chocobois Game Jam Template

We make game, but faster

## Quick start

1. Clone the repository
2. `npm install`
3. `npm run dev`

Remember to update [`game.config.json`](game.config.json) accordingly.

## Debugging

* You need Chrome installed
* Hit F5 to debug
    * This will launch Vite and Chrome
    * You can now add breakpoints in VS Code
* Hit Shift+F5 twice to stop debugging

## Building

1. `npm run build`
2. Build goes to `/dist` directory

## Deploying
### GitHub
The repository is configured to automatically deploy to Github Pages, you just have to change a setting on the repository to deploy from a branch and set the deploy branch to `gh-pages`.

It will also create new downloads under releases.
### Itch
You can configure this repository to automatically deploy and upload releases to Itch. What you have to do is set the `BUTLER_CREDENTIALS` repository secret and set your Itch username and game name in [`game.config.json`](game.config.json).

## System requirements
### Web version
A modern up-to-date web browser

### Windows
* Microsoft Edge 89 or newer
* [WebView2](https://go.microsoft.com/fwlink/p/?LinkId=2124703) installed (Windows 11 has this preinstalled)

### MacOS
* Safari 15 or newer

### Linux
* WebKitGTK installed
