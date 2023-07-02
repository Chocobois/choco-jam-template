import './neutralino';

const NeutralinoLoad = () => {
    Neutralino.init();

    Neutralino.events.on("windowClose", () => {
        Neutralino.app.exit();
    });
    Neutralino.events.on("windowFocus", () => {
        Neutralino.window.center();
    })
}

if ( window.NL_TOKEN ) {
    NeutralinoLoad();
}
