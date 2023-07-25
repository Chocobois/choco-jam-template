import * as Neutralino from '@neutralinojs/lib';
type Neutralino = typeof import('@neutralinojs/lib');

const NeutralinoLoad = (Neutralino: Neutralino) => {
    Neutralino.events.on("windowClose", () => {
        Neutralino.app.exit();
    });

    Neutralino.events.on("ready", () => {
        Neutralino.window.center();
    })
}

if((window as any).NL_TOKEN) {
    Neutralino.init();
    NeutralinoLoad(Neutralino);
}
