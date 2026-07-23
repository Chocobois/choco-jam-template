import type { PluginOption } from "vite";

export default function hmrScenes(): PluginOption {
  return {
    name: "hmr-scenes",
    apply: "serve",
    transform(code, id) {
      if (id.endsWith("game.ts")) {
        return {
          code: code.replace(
            "const game = new Phaser.Game(config);",
            "const game = new Phaser.Game(config);\n  window.__PHASER_GAME__ = game;"
          ),
          map: null,
        };
      }

      if (!id.includes("/scenes/")) return;
      if (!id.endsWith(".ts")) return;
      if (id.includes("PreloadScene")) return;

      const match = code.match(/export class (\w+)/);
      if (!match) return;
      const className = match[1];

      const hmrBlock = `
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    const game = window.__PHASER_GAME__;
    if (!game || !newModule) return;

    const newClass = newModule.${className};
    const sceneManager = game.scene;
    const scene = sceneManager.getScenes(false).find(s => s.constructor.name === "${className}");
    if (!scene) return;

    const key = scene.scene.key;
    const isActive = sceneManager.isActive(key);

    scene.sound.stopAll();
    scene.tweens.killAll();
    scene.time.removeAllEvents();
    sceneManager.stop(key);
    sceneManager.remove(key);
    sceneManager.add(key, newClass, isActive);
  });
}`;

      return { code: code + hmrBlock, map: null };
    },
  };
}