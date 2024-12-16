import { defineConfig } from "vite";

import zip from "vite-plugin-zip-pack";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import getGitVersion from "./scripts/git-version";
import preImageOptimizer from "./scripts/pre-image-optimizer";
import neuBuild from "./scripts/neu-build";
import neuInject from "./scripts/neu-inject";
import bundleWinApp from "./scripts/win-bundle";
import bundleMacApp from "./scripts/mac-bundle";
import bundleLinuxApp from "./scripts/linux-bundle";
import buildCleanup from "./scripts/build-cleanup";

import { title, team, description, title_dashed } from "./scripts/constants";

export default () => {
  process.env.VITE_GAME_TITLE = title;
  process.env.VITE_GAME_TEAM = team;
  process.env.VITE_GAME_DESCRIPTION = description;

  return defineConfig({
    base: "./",
    root: "src",
    plugins: [
      tsconfigPaths(),
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
    build: {
      outDir: "../dist/web",
      chunkSizeWarningLimit: 4096,
      assetsInlineLimit: 0,
      target: "ES2022",
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
  });
};
