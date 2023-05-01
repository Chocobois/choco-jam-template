import './neutralino';

const NeutralinoLoad = () => {
    const onWindowClose = () => {
        Neutralino.app.exit();
    }

    Neutralino.init();
    Neutralino.events.on("windowClose", onWindowClose);
}

if ( window.NL_TOKEN ) {
    NeutralinoLoad();
}
