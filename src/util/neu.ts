import * as Neutralino from "@neutralinojs/lib";

export const isNeutralino = !!window.NL_TOKEN;

if (isNeutralino) {
  Neutralino.init();
  Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
  });
  Neutralino.window.center();
}
