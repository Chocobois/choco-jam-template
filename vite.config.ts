import { defineConfig } from "vite";

import { VitePWA } from "vite-plugin-pwa";
import zip from "vite-plugin-zip-pack";
import checker from "vite-plugin-checker";
import getGitVersion from "./scripts/git-version";
import preImageOptimizer from "./scripts/pre-image-optimizer";
import neuBuild from "./scripts/neu-build";
import neuInject from "./scripts/neu-inject";
import bundleWinApp from "./scripts/win-bundle";
import bundleMacApp from "./scripts/mac-bundle";
import bundleLinuxApp from "./scripts/linux-bundle";
import buildCleanup from "./scripts/build-cleanup";

import {
  title,
  team,
  description,
  title_dashed,
  game_url,
  game_image,
  game_icon,
  repo_name,
} from "./scripts/constants";
import pwaMode from "./scripts/pwa-mode";

export default defineConfig(({mode}) => {
  process.env.VITE_GAME_TITLE = title;
  process.env.VITE_GAME_TEAM = team;
  process.env.VITE_GAME_DESCRIPTION = description;
  process.env.VITE_GAME_URL = game_url;
  process.env.VITE_GAME_IMAGE = game_image;
  process.env.VITE_GAME_ICON = game_icon;

  const isProdOrPreview = mode === 'production';
  const basePath = isProdOrPreview ? `/${repo_name}/` : '/';

  return {
    base: basePath,
    root: "src",
    plugins: [
      pwaMode(mode),
      getGitVersion(),
      checker({
        typescript: true,
      }),
      preImageOptimizer(),
      neuInject(),
      neuBuild(),
      bundleWinApp(),
      bundleMacApp(),
      bundleLinuxApp(),
      zip({
        inDir: "./dist/web",
        outDir: "./dist",
        outFileName: `${title_dashed}-web.zip`,
      }),
      zip({
        inDir: `./dist/win`,
        outDir: "./dist",
        outFileName: `${title_dashed}-win.zip`,
      }),
      zip({
        inDir: `./dist/linux`,
        outDir: "./dist",
        outFileName: `${title_dashed}-linux.zip`,
      }),
      buildCleanup(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      outDir: "../dist/web",
      emptyOutDir: false,
      chunkSizeWarningLimit: 4096,
      assetsInlineLimit: 0,
      target: "es2022",
      cssTarget: "esnext",
      minify: "terser",
      terserOptions: {
        format: {
          comments: false,
        },
      },
    },
    server: {
      host: "localhost",
    },
  };
});
