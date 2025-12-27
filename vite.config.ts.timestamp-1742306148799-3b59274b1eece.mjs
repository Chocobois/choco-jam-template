// vite.config.ts
import { defineConfig } from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/vite/dist/node/index.js";
import zip from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/vite-plugin-zip-pack/dist/esm/index.mjs";
import checker from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/vite-plugin-checker/dist/esm/main.js";
import tsconfigPaths from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/vite-tsconfig-paths/dist/index.mjs";

// automation/git-version.ts
import { writeFileSync } from "fs";

// automation/constants.ts
import { execSync } from "child_process";
import { platform } from "os";

// game.config.json
var team = "Chocobois";
var title = "Game Jam Template";
var description = "We make game, but faster!";
var neutralino = {
  allow: ["app.exit", "window.center"]
};

// automation/constants.ts
var tryCatch = (fun, fallback) => {
  try {
    return fun();
  } catch (e) {
    return fallback;
  }
};
var git_count = tryCatch(() => execSync("git rev-list --count HEAD").toString().trim(), "-1");
var git_short = tryCatch(() => execSync("git rev-parse --short HEAD").toString().trim(), "no-git");
var git_version = `v${git_count}.${git_short}`;
var year_current = (/* @__PURE__ */ new Date()).getFullYear();
var year_initial = tryCatch(() => Number(
  platform() == "win32" ? execSync('git log --reverse | findstr "Date"').toString().match(/(\d+) \+/)?.[1] : execSync('git log --reverse | grep "Date" -m 1').toString().match(/(\d+) \+/)?.[1]
), year_current);
var year_copyright = year_initial == year_current ? `${year_initial}` : `${year_initial} - ${year_current}`;
var team_dashed = team.toLowerCase().replace(/\s/gi, "-");
var title_dashed = title.toLowerCase().replace(/\s/gi, "-");
var game_dir = `${team_dashed}-${title_dashed}`;
var build_path = `./dist/${game_dir}/`;

// automation/git-version.ts
var WriteGitVersion = () => {
  writeFileSync("./src/version.json", JSON.stringify({
    title,
    team,
    count: git_count,
    short: git_short,
    version: git_version
  }));
};
function writeGitVersion() {
  return {
    name: "write-version-json",
    buildStart: WriteGitVersion
  };
}

// automation/pre-image-optimizer.ts
import { ViteImageOptimizer } from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/vite-plugin-image-optimizer/dist/index.mjs";
var pre_image_optimizer_default = (options) => {
  const optimizer = ViteImageOptimizer(options);
  optimizer.closeBundle = { sequential: true, handler: optimizer.closeBundle };
  optimizer.enforce = "pre";
  return optimizer;
};

// automation/neu-template.json
var neu_template_default = {
  applicationId: "chocobois-jam-template",
  version: "1.0.0",
  defaultMode: "window",
  port: 0,
  documentRoot: "/dist/web/",
  url: "/",
  enableServer: true,
  enableNativeAPI: true,
  tokenSecurity: "one-time",
  logging: {
    enabled: true,
    writeToLogFile: false
  },
  nativeAllowList: ["app.exit", "window.center"],
  modes: {
    window: {
      title: "Chocobois Game Jam Template",
      width: 1440,
      height: 845,
      minWidth: 960,
      minHeight: 570,
      fullScreen: false,
      alwaysOnTop: false,
      icon: "src/public/icon.png",
      enableInspector: false,
      borderless: false,
      maximize: false,
      hidden: false,
      resizable: true,
      exitProcessOnClose: false,
      useSavedState: false
    }
  },
  cli: {
    binaryName: "chocobois-jam-template",
    resourcesPath: "/dist/",
    frontendLibrary: {
      patchFile: "/src/index.html",
      devUrl: "http://localhost:5173",
      projectPath: "/"
    }
  }
};

// automation/write-neu-config.ts
import { writeFileSync as writeFileSync2 } from "fs";
function WriteNeuConfig(isProd) {
  neu_template_default.applicationId = `${team_dashed}.${title_dashed}`;
  neu_template_default.modes.window.title = `${title} by ${team}`;
  neu_template_default.cli.binaryName = `${team_dashed}-${title_dashed}`;
  neu_template_default.version = `0.0.${git_count}`;
  if (isProd) {
    neu_template_default.documentRoot = "/web/";
    neu_template_default.cli.resourcesPath = "/";
    neu_template_default.modes.window.icon = "/web/icon.png";
  } else {
    neu_template_default.tokenSecurity = "none";
  }
  neu_template_default.nativeAllowList = [...neu_template_default.nativeAllowList, ...neutralino.allow];
  writeFileSync2(isProd ? "dist/neutralino.config.json" : "neutralino.config.json", JSON.stringify(neu_template_default));
  writeFileSync2("./src/public/__neutralino_globals.js", "// Dummy file");
}

// automation/neu-build.ts
import { createPackage } from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/@electron/asar/lib/asar.js";
function neuBuild() {
  return {
    name: "neu-build",
    apply: "build",
    enforce: "pre",
    async closeBundle() {
      console.log("Building game app");
      WriteNeuConfig(true);
      await createPackage("dist", "bin/resources.neu");
    }
  };
}

// automation/neu-inject.ts
import { readFileSync } from "fs";
var tryCatch2 = (fun, fallback) => {
  try {
    return fun();
  } catch (e) {
    return fallback;
  }
};
var getGlobalsPath = () => {
  const isDev = process.env.NODE_ENV == "development";
  const authInfo = JSON.parse(tryCatch2(() => readFileSync(".tmp/auth_info.json").toString(), "{}"));
  const port = authInfo.nlPort;
  return `${isDev && port ? `http://localhost:${port}/` : ""}__neutralino_globals.js`;
};
function neuInject() {
  return {
    name: "neu-inject",
    transformIndexHtml: (html) => {
      return {
        html,
        tags: [{
          tag: "script",
          injectTo: "head-prepend",
          attrs: {
            src: getGlobalsPath()
          }
        }]
      };
    }
  };
}

// automation/win-bundle.ts
import { mkdirSync, copyFileSync, readFileSync as readFileSync2, writeFileSync as writeFileSync3 } from "fs";
import { NtExecutable, NtExecutableResource, Data, Resource } from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/resedit/dist/index.js";
import pngToIco from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/png-to-ico/index.js";
var BundleWinApp = async () => {
  console.log(`Packaging Windows exe...`);
  const out_dir = `./dist/win/${title_dashed}`;
  mkdirSync("./dist/win");
  mkdirSync(out_dir);
  copyFileSync(`bin/resources.neu`, `${out_dir}/resources.neu`);
  const data = readFileSync2(`bin/neutralino-win_x64.exe`);
  const exe = NtExecutable.from(data);
  const res = NtExecutableResource.from(exe);
  const pngData = readFileSync2("./src/public/icon.png");
  const iconFile = Data.IconFile.from(await pngToIco(pngData));
  Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    101,
    1033,
    iconFile.icons.map((item) => item.data)
  );
  const vi = Resource.VersionInfo.createEmpty();
  vi.setFileVersion(0, 0, Number(git_count), 0, 1033);
  vi.setStringValues(
    { lang: 1033, codepage: 1200 },
    {
      FileDescription: description,
      ProductName: `${title} by ${team}`,
      ProductVersion: git_version,
      CompanyName: team
    }
  );
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  writeFileSync3(`${out_dir}/${title}.exe`, Buffer.from(exe.generate()));
};
function bundleWinApp() {
  return {
    name: "build-windows-bundle",
    apply: "build",
    enforce: "pre",
    closeBundle: {
      handler: BundleWinApp,
      sequential: true
    }
  };
}

// automation/mac-bundle.ts
import { execSync as execSync2 } from "child_process";
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync4, copyFileSync as copyFileSync2, renameSync } from "fs";
var BundleMacApp = () => {
  console.log(`Packaging Mac dmg...`);
  const bootstrapper = `#!/usr/bin/env bash
MACOS="$( cd -- "$( dirname -- "\${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
CONTENTS="$(dirname "$MACOS")"
exec "\${MACOS}/game" --path="\${CONTENTS}/Resources" --enable-extensions=true`;
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSHumanReadableCopyright</key>
  <string>${title} ${git_version} \xA9 ${team} ${year_copyright}</string>
  <key>CFBundleExecutable</key>
  <string>bootstrapper</string>
  <key>CFBundleIdentifier</key>
  <string>com.${team_dashed}.${title_dashed}</string>
  <key>CFBundleName</key>
  <string>${title}</string>
  <key>CFBundleIconFile</key>
  <string>icon.png</string>
  <key>CFBundleShortVersionString</key>
  <string>0.${git_count}</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>IFMajorVersion</key>
  <integer>0</integer>
  <key>IFMinorVersion</key>
  <integer>${git_count}</integer>
</dict>
</plist>`;
  const out_dir = `./dist/mac/${title}`;
  mkdirSync2(`./dist/mac/`);
  mkdirSync2(out_dir);
  mkdirSync2(`${out_dir}/Contents`);
  mkdirSync2(`${out_dir}/Contents/MacOS`);
  mkdirSync2(`${out_dir}/Contents/Resources`);
  writeFileSync4(`${out_dir}/Contents/MacOS/bootstrapper`, bootstrapper);
  writeFileSync4(`${out_dir}/Contents/info.plist`, plist);
  copyFileSync2(`bin/neutralino-mac_universal`, `${out_dir}/Contents/MacOS/game`);
  copyFileSync2(`bin/resources.neu`, `${out_dir}/Contents/Resources/resources.neu`);
  copyFileSync2(`./src/public/icon.png`, `${out_dir}/Contents/Resources/icon.png`);
  renameSync(out_dir, `${out_dir}.app`);
  try {
    execSync2(`mkisofs -J -R -o ./dist/${title_dashed}-mac.dmg -mac-name -V "${title}" -apple -v -dir-mode 777 -file-mode 777 "./dist/mac/"`);
  } catch (err) {
    console.log(`Failed to build dmg`);
  }
};
function bundleMacApp() {
  return {
    name: "build-mac-bundle",
    apply: "build",
    closeBundle: BundleMacApp
  };
}

// automation/linux-bundle.ts
import { mkdirSync as mkdirSync3, copyFileSync as copyFileSync3 } from "fs";
var BundleLinuxApp = () => {
  console.log(`Packaging Linux app...`);
  const out_dir = `./dist/linux/${title_dashed}`;
  mkdirSync3("./dist/linux");
  mkdirSync3(out_dir);
  copyFileSync3(`bin/neutralino-linux_x64`, `${out_dir}/${title_dashed}-x64`);
  copyFileSync3(`bin/neutralino-linux_arm64`, `${out_dir}/${title_dashed}-arm64`);
  copyFileSync3(`bin/neutralino-linux_armhf`, `${out_dir}/${title_dashed}-armhf`);
  copyFileSync3(`bin/resources.neu`, `${out_dir}/resources.neu`);
};
function bundleLinuxApp() {
  return {
    name: "build-linux-bundle",
    apply: "build",
    closeBundle: BundleLinuxApp
  };
}

// automation/build-cleanup.ts
import { rimrafSync } from "file:///C:/Users/Lumie/Desktop/ISFGame/choco-jam-template/node_modules/rimraf/dist/esm/index.js";
import { writeFileSync as writeFileSync5 } from "fs";
var BuildCleanup = () => {
  rimrafSync(build_path);
  rimrafSync("./dist/neutralino.config.json");
  rimrafSync("./neutralino.config.json");
  writeFileSync5("./dist/meta.json", JSON.stringify({ title: title_dashed }));
};
function buildCleanup() {
  return {
    name: "build-cleanup",
    apply: "build",
    enforce: "post",
    closeBundle: BuildCleanup
  };
}

// vite.config.ts
var vite_config_default = () => {
  process.env.VITE_GAME_TITLE = title;
  process.env.VITE_GAME_TEAM = team;
  process.env.VITE_GAME_DESCRIPTION = description;
  return defineConfig({
    base: "./",
    root: "src",
    plugins: [
      tsconfigPaths(),
      writeGitVersion(),
      checker({
        typescript: true
      }),
      pre_image_optimizer_default(),
      neuInject(),
      neuBuild(),
      bundleWinApp(),
      bundleMacApp(),
      bundleLinuxApp(),
      zip({
        inDir: "./dist/web",
        outDir: "./dist",
        outFileName: `${title_dashed}-web.zip`
      }),
      zip({
        inDir: `./dist/win`,
        outDir: "./dist",
        outFileName: `${title_dashed}-win.zip`
      }),
      zip({
        inDir: `./dist/linux`,
        outDir: "./dist",
        outFileName: `${title_dashed}-linux.zip`
      }),
      buildCleanup()
    ],
    build: {
      outDir: "../dist/web",
      chunkSizeWarningLimit: 4096,
      assetsInlineLimit: 0,
      target: "ES2022",
      minify: "terser",
      terserOptions: {
        format: {
          comments: false
        }
      }
    },
    server: {
      host: "localhost"
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYXV0b21hdGlvbi9naXQtdmVyc2lvbi50cyIsICJhdXRvbWF0aW9uL2NvbnN0YW50cy50cyIsICJnYW1lLmNvbmZpZy5qc29uIiwgImF1dG9tYXRpb24vcHJlLWltYWdlLW9wdGltaXplci50cyIsICJhdXRvbWF0aW9uL25ldS10ZW1wbGF0ZS5qc29uIiwgImF1dG9tYXRpb24vd3JpdGUtbmV1LWNvbmZpZy50cyIsICJhdXRvbWF0aW9uL25ldS1idWlsZC50cyIsICJhdXRvbWF0aW9uL25ldS1pbmplY3QudHMiLCAiYXV0b21hdGlvbi93aW4tYnVuZGxlLnRzIiwgImF1dG9tYXRpb24vbWFjLWJ1bmRsZS50cyIsICJhdXRvbWF0aW9uL2xpbnV4LWJ1bmRsZS50cyIsICJhdXRvbWF0aW9uL2J1aWxkLWNsZWFudXAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcblxyXG5pbXBvcnQgemlwIGZyb20gJ3ZpdGUtcGx1Z2luLXppcC1wYWNrJztcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgZ2V0R2l0VmVyc2lvbiBmcm9tICcuL2F1dG9tYXRpb24vZ2l0LXZlcnNpb24nO1xyXG5pbXBvcnQgcHJlSW1hZ2VPcHRpbWl6ZXIgZnJvbSAnLi9hdXRvbWF0aW9uL3ByZS1pbWFnZS1vcHRpbWl6ZXInO1xyXG5pbXBvcnQgbmV1QnVpbGQgZnJvbSAnLi9hdXRvbWF0aW9uL25ldS1idWlsZCc7XHJcbmltcG9ydCBuZXVJbmplY3QgZnJvbSAnLi9hdXRvbWF0aW9uL25ldS1pbmplY3QnO1xyXG5pbXBvcnQgYnVuZGxlV2luQXBwIGZyb20gJy4vYXV0b21hdGlvbi93aW4tYnVuZGxlJztcclxuaW1wb3J0IGJ1bmRsZU1hY0FwcCBmcm9tICcuL2F1dG9tYXRpb24vbWFjLWJ1bmRsZSc7XHJcbmltcG9ydCBidW5kbGVMaW51eEFwcCBmcm9tICcuL2F1dG9tYXRpb24vbGludXgtYnVuZGxlJztcclxuaW1wb3J0IGJ1aWxkQ2xlYW51cCBmcm9tICcuL2F1dG9tYXRpb24vYnVpbGQtY2xlYW51cCc7XHJcblxyXG5pbXBvcnQgeyB0aXRsZSwgdGVhbSwgZGVzY3JpcHRpb24sIHRpdGxlX2Rhc2hlZCB9IGZyb20gJy4vYXV0b21hdGlvbi9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xyXG5cdHByb2Nlc3MuZW52LlZJVEVfR0FNRV9USVRMRSA9IHRpdGxlO1xyXG5cdHByb2Nlc3MuZW52LlZJVEVfR0FNRV9URUFNID0gdGVhbTtcclxuXHRwcm9jZXNzLmVudi5WSVRFX0dBTUVfREVTQ1JJUFRJT04gPSBkZXNjcmlwdGlvbjtcclxuXHJcblx0cmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcblx0XHRiYXNlOiAnLi8nLFxyXG5cdFx0cm9vdDogJ3NyYycsXHJcblx0XHRwbHVnaW5zOiBbXHJcblx0XHRcdHRzY29uZmlnUGF0aHMoKSxcclxuXHRcdFx0Z2V0R2l0VmVyc2lvbigpLFxyXG5cdFx0XHRjaGVja2VyKHtcclxuXHRcdFx0XHR0eXBlc2NyaXB0OiB0cnVlLFxyXG5cdFx0XHR9KSxcclxuXHRcdFx0cHJlSW1hZ2VPcHRpbWl6ZXIoKSxcclxuXHRcdFx0bmV1SW5qZWN0KCksXHJcblx0XHRcdG5ldUJ1aWxkKCksXHJcblx0XHRcdGJ1bmRsZVdpbkFwcCgpLFxyXG5cdFx0XHRidW5kbGVNYWNBcHAoKSxcclxuXHRcdFx0YnVuZGxlTGludXhBcHAoKSxcclxuXHRcdFx0emlwKHtcclxuXHRcdFx0XHRpbkRpcjogJy4vZGlzdC93ZWInLFxyXG5cdFx0XHRcdG91dERpcjogJy4vZGlzdCcsXHJcblx0XHRcdFx0b3V0RmlsZU5hbWU6IGAke3RpdGxlX2Rhc2hlZH0td2ViLnppcGAsXHJcblx0XHRcdH0pLFxyXG5cdFx0XHR6aXAoe1xyXG5cdFx0XHRcdGluRGlyOiBgLi9kaXN0L3dpbmAsXHJcblx0XHRcdFx0b3V0RGlyOiAnLi9kaXN0JyxcclxuXHRcdFx0XHRvdXRGaWxlTmFtZTogYCR7dGl0bGVfZGFzaGVkfS13aW4uemlwYCxcclxuXHRcdFx0fSksXHJcblx0XHRcdHppcCh7XHJcblx0XHRcdFx0aW5EaXI6IGAuL2Rpc3QvbGludXhgLFxyXG5cdFx0XHRcdG91dERpcjogJy4vZGlzdCcsXHJcblx0XHRcdFx0b3V0RmlsZU5hbWU6IGAke3RpdGxlX2Rhc2hlZH0tbGludXguemlwYCxcclxuXHRcdFx0fSksXHJcblx0XHRcdGJ1aWxkQ2xlYW51cCgpLFxyXG5cdFx0XSxcclxuXHRcdGJ1aWxkOiB7XHJcblx0XHRcdG91dERpcjogJy4uL2Rpc3Qvd2ViJyxcclxuXHRcdFx0Y2h1bmtTaXplV2FybmluZ0xpbWl0OiA0MDk2LFxyXG5cdFx0XHRhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuXHRcdFx0dGFyZ2V0OiAnRVMyMDIyJyxcclxuXHRcdFx0bWluaWZ5OiAndGVyc2VyJyxcclxuXHRcdFx0dGVyc2VyT3B0aW9uczoge1xyXG5cdFx0XHRcdGZvcm1hdDoge1xyXG5cdFx0XHRcdFx0Y29tbWVudHM6IGZhbHNlLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdFx0c2VydmVyOiB7XHJcblx0XHRcdGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG5cdFx0fSxcclxuXHR9KTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxnaXQtdmVyc2lvbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTHVtaWUvRGVza3RvcC9JU0ZHYW1lL2Nob2NvLWphbS10ZW1wbGF0ZS9hdXRvbWF0aW9uL2dpdC12ZXJzaW9uLnRzXCI7aW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHdyaXRlRmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IGdpdF9jb3VudCwgZ2l0X3Nob3J0LCBnaXRfdmVyc2lvbiwgdGl0bGUsIHRlYW0gfSBmcm9tICcuL2NvbnN0YW50cyc7XHJcblxyXG5jb25zdCBXcml0ZUdpdFZlcnNpb24gPSAoKSA9PiB7XHJcblx0d3JpdGVGaWxlU3luYygnLi9zcmMvdmVyc2lvbi5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0dGl0bGUsXHJcblx0XHR0ZWFtLFxyXG5cdFx0Y291bnQ6IGdpdF9jb3VudCxcclxuXHRcdHNob3J0OiBnaXRfc2hvcnQsXHJcblx0XHR2ZXJzaW9uOiBnaXRfdmVyc2lvblxyXG5cdH0pKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JpdGVHaXRWZXJzaW9uKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRuYW1lOiAnd3JpdGUtdmVyc2lvbi1qc29uJyxcclxuXHRcdGJ1aWxkU3RhcnQ6IFdyaXRlR2l0VmVyc2lvblxyXG5cdH0gYXMgUGx1Z2luT3B0aW9uO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVtaWVcXFxcRGVza3RvcFxcXFxJU0ZHYW1lXFxcXGNob2NvLWphbS10ZW1wbGF0ZVxcXFxhdXRvbWF0aW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cXFxcY29uc3RhbnRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL2F1dG9tYXRpb24vY29uc3RhbnRzLnRzXCI7aW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICdvcyc7XHJcbmltcG9ydCB7IHRlYW0sIHRpdGxlLCBkZXNjcmlwdGlvbiwgbmV1dHJhbGlubyB9IGZyb20gJy4uL2dhbWUuY29uZmlnLmpzb24nO1xyXG5cclxuZXhwb3J0IHsgdGVhbSwgdGl0bGUsIGRlc2NyaXB0aW9uLCBuZXV0cmFsaW5vIH07XHJcblxyXG5jb25zdCB0cnlDYXRjaCA9IDxUPihmdW46ICgpID0+IFQsIGZhbGxiYWNrOiBUKTogVCA9PiB7XHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBmdW4oKTtcclxuXHR9IGNhdGNoKGUpIHtcclxuXHRcdHJldHVybiBmYWxsYmFjaztcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnaXRfY291bnQgPSB0cnlDYXRjaCgoKSA9PiBleGVjU3luYygnZ2l0IHJldi1saXN0IC0tY291bnQgSEVBRCcpLnRvU3RyaW5nKCkudHJpbSgpLCBcIi0xXCIpO1xyXG5leHBvcnQgY29uc3QgZ2l0X3Nob3J0ID0gdHJ5Q2F0Y2goKCkgPT4gZXhlY1N5bmMoJ2dpdCByZXYtcGFyc2UgLS1zaG9ydCBIRUFEJykudG9TdHJpbmcoKS50cmltKCksIFwibm8tZ2l0XCIpO1xyXG5leHBvcnQgY29uc3QgZ2l0X3ZlcnNpb24gPSBgdiR7Z2l0X2NvdW50fS4ke2dpdF9zaG9ydH1gO1xyXG5cclxuZXhwb3J0IGNvbnN0IHllYXJfY3VycmVudCA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuZXhwb3J0IGNvbnN0IHllYXJfaW5pdGlhbCA9IHRyeUNhdGNoKCgpID0+IE51bWJlcihwbGF0Zm9ybSgpID09ICd3aW4zMidcclxuXHRcdD8gZXhlY1N5bmMoJ2dpdCBsb2cgLS1yZXZlcnNlIHwgZmluZHN0ciBcIkRhdGVcIicpLnRvU3RyaW5nKCkubWF0Y2goLyhcXGQrKSBcXCsvKT8uWzFdXHJcblx0XHQ6IGV4ZWNTeW5jKCdnaXQgbG9nIC0tcmV2ZXJzZSB8IGdyZXAgXCJEYXRlXCIgLW0gMScpLnRvU3RyaW5nKCkubWF0Y2goLyhcXGQrKSBcXCsvKT8uWzFdXHJcbiksIHllYXJfY3VycmVudCk7XHJcbmV4cG9ydCBjb25zdCB5ZWFyX2NvcHlyaWdodCA9IHllYXJfaW5pdGlhbCA9PSB5ZWFyX2N1cnJlbnQgXHJcblx0XHQ/IGAke3llYXJfaW5pdGlhbH1gIDogYCR7eWVhcl9pbml0aWFsfSAtICR7eWVhcl9jdXJyZW50fWA7XHJcblxyXG5leHBvcnQgY29uc3QgdGVhbV9kYXNoZWQgPSB0ZWFtLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzL2dpLCAnLScpO1xyXG5leHBvcnQgY29uc3QgdGl0bGVfZGFzaGVkID0gdGl0bGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMvZ2ksICctJyk7XHJcbmV4cG9ydCBjb25zdCBnYW1lX2RpciA9IGAke3RlYW1fZGFzaGVkfS0ke3RpdGxlX2Rhc2hlZH1gO1xyXG5leHBvcnQgY29uc3QgYnVpbGRfcGF0aCA9IGAuL2Rpc3QvJHtnYW1lX2Rpcn0vYDtcclxuXHJcbiIsICJ7XHJcblx0XCJ0ZWFtXCI6IFwiQ2hvY29ib2lzXCIsXHJcblx0XCJ0aXRsZVwiOiBcIkdhbWUgSmFtIFRlbXBsYXRlXCIsXHJcblx0XCJkZXNjcmlwdGlvblwiOiBcIldlIG1ha2UgZ2FtZSwgYnV0IGZhc3RlciFcIixcclxuXHRcIml0Y2hcIjoge1xyXG5cdFx0XCJ1cGxvYWRcIjogZmFsc2UsXHJcblx0XHRcInVzZXJuYW1lXCI6IFwidXNlcm5hbWVcIixcclxuXHRcdFwiZ2FtZVwiOiBcImdhbWUtbmFtZVwiXHJcblx0fSxcclxuXHRcIm5ldXRyYWxpbm9cIjoge1xyXG5cdFx0XCJhbGxvd1wiOiBbXCJhcHAuZXhpdFwiLCBcIndpbmRvdy5jZW50ZXJcIl1cclxuXHR9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxwcmUtaW1hZ2Utb3B0aW1pemVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL2F1dG9tYXRpb24vcHJlLWltYWdlLW9wdGltaXplci50c1wiO2ltcG9ydCB7IFZpdGVJbWFnZU9wdGltaXplciB9IGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlLW9wdGltaXplcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAob3B0aW9ucz86IFBhcmFtZXRlcnM8dHlwZW9mIFZpdGVJbWFnZU9wdGltaXplcj5bMF0pID0+IHtcclxuXHRjb25zdCBvcHRpbWl6ZXIgPSBWaXRlSW1hZ2VPcHRpbWl6ZXIob3B0aW9ucyk7XHJcblx0b3B0aW1pemVyLmNsb3NlQnVuZGxlID0geyBzZXF1ZW50aWFsOiB0cnVlLCBoYW5kbGVyOiBvcHRpbWl6ZXIuY2xvc2VCdW5kbGUgYXMgYW55fVxyXG5cdG9wdGltaXplci5lbmZvcmNlID0gJ3ByZSc7XHJcblx0cmV0dXJuIG9wdGltaXplcjtcclxufVxyXG4iLCAie1xyXG5cdFwiYXBwbGljYXRpb25JZFwiOiBcImNob2NvYm9pcy1qYW0tdGVtcGxhdGVcIixcclxuXHRcInZlcnNpb25cIjogXCIxLjAuMFwiLFxyXG5cdFwiZGVmYXVsdE1vZGVcIjogXCJ3aW5kb3dcIixcclxuXHRcInBvcnRcIjogMCxcclxuXHRcImRvY3VtZW50Um9vdFwiOiBcIi9kaXN0L3dlYi9cIixcclxuXHRcInVybFwiOiBcIi9cIixcclxuXHRcImVuYWJsZVNlcnZlclwiOiB0cnVlLFxyXG5cdFwiZW5hYmxlTmF0aXZlQVBJXCI6IHRydWUsXHJcblx0XCJ0b2tlblNlY3VyaXR5XCI6IFwib25lLXRpbWVcIixcclxuXHRcImxvZ2dpbmdcIjoge1xyXG5cdFx0XCJlbmFibGVkXCI6IHRydWUsXHJcblx0XHRcIndyaXRlVG9Mb2dGaWxlXCI6IGZhbHNlXHJcblx0fSxcclxuXHRcIm5hdGl2ZUFsbG93TGlzdFwiOiBbXCJhcHAuZXhpdFwiLCBcIndpbmRvdy5jZW50ZXJcIl0sXHJcblx0XCJtb2Rlc1wiOiB7XHJcblx0XHRcIndpbmRvd1wiOiB7XHJcblx0XHRcdFwidGl0bGVcIjogXCJDaG9jb2JvaXMgR2FtZSBKYW0gVGVtcGxhdGVcIixcclxuXHRcdFx0XCJ3aWR0aFwiOiAxNDQwLFxyXG5cdFx0XHRcImhlaWdodFwiOiA4NDUsXHJcblx0XHRcdFwibWluV2lkdGhcIjogOTYwLFxyXG5cdFx0XHRcIm1pbkhlaWdodFwiOiA1NzAsXHJcblx0XHRcdFwiZnVsbFNjcmVlblwiOiBmYWxzZSxcclxuXHRcdFx0XCJhbHdheXNPblRvcFwiOiBmYWxzZSxcclxuXHRcdFx0XCJpY29uXCI6IFwic3JjL3B1YmxpYy9pY29uLnBuZ1wiLFxyXG5cdFx0XHRcImVuYWJsZUluc3BlY3RvclwiOiBmYWxzZSxcclxuXHRcdFx0XCJib3JkZXJsZXNzXCI6IGZhbHNlLFxyXG5cdFx0XHRcIm1heGltaXplXCI6IGZhbHNlLFxyXG5cdFx0XHRcImhpZGRlblwiOiBmYWxzZSxcclxuXHRcdFx0XCJyZXNpemFibGVcIjogdHJ1ZSxcclxuXHRcdFx0XCJleGl0UHJvY2Vzc09uQ2xvc2VcIjogZmFsc2UsXHJcblx0XHRcdFwidXNlU2F2ZWRTdGF0ZVwiOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XCJjbGlcIjoge1xyXG5cdFx0XCJiaW5hcnlOYW1lXCI6IFwiY2hvY29ib2lzLWphbS10ZW1wbGF0ZVwiLFxyXG5cdFx0XCJyZXNvdXJjZXNQYXRoXCI6IFwiL2Rpc3QvXCIsXHJcblx0XHRcImZyb250ZW5kTGlicmFyeVwiOiB7XHJcblx0XHQgIFwicGF0Y2hGaWxlXCI6IFwiL3NyYy9pbmRleC5odG1sXCIsXHJcblx0XHQgIFwiZGV2VXJsXCI6IFwiaHR0cDovL2xvY2FsaG9zdDo1MTczXCIsXHJcblx0XHQgIFwicHJvamVjdFBhdGhcIjogXCIvXCJcclxuXHRcdH1cclxuXHR9XHJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVtaWVcXFxcRGVza3RvcFxcXFxJU0ZHYW1lXFxcXGNob2NvLWphbS10ZW1wbGF0ZVxcXFxhdXRvbWF0aW9uXFxcXHdyaXRlLW5ldS1jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1bWllL0Rlc2t0b3AvSVNGR2FtZS9jaG9jby1qYW0tdGVtcGxhdGUvYXV0b21hdGlvbi93cml0ZS1uZXUtY29uZmlnLnRzXCI7aW1wb3J0IHsgdGVhbSwgdGl0bGUsIHRlYW1fZGFzaGVkLCB0aXRsZV9kYXNoZWQsIGdpdF9jb3VudCwgbmV1dHJhbGlubyB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuaW1wb3J0IG5ldUNvbmYgZnJvbSAnLi9uZXUtdGVtcGxhdGUuanNvbic7XHJcbmltcG9ydCB7IHdyaXRlRmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXcml0ZU5ldUNvbmZpZyhpc1Byb2Q6IGJvb2xlYW4pIHtcclxuXHRuZXVDb25mLmFwcGxpY2F0aW9uSWQgPSBgJHt0ZWFtX2Rhc2hlZH0uJHt0aXRsZV9kYXNoZWR9YDtcclxuXHRuZXVDb25mLm1vZGVzLndpbmRvdy50aXRsZSA9IGAke3RpdGxlfSBieSAke3RlYW19YDtcclxuXHRuZXVDb25mLmNsaS5iaW5hcnlOYW1lID0gYCR7dGVhbV9kYXNoZWR9LSR7dGl0bGVfZGFzaGVkfWA7XHJcblx0bmV1Q29uZi52ZXJzaW9uID0gYDAuMC4ke2dpdF9jb3VudH1gO1xyXG5cdGlmKGlzUHJvZCkge1xyXG5cdFx0bmV1Q29uZi5kb2N1bWVudFJvb3QgPSBcIi93ZWIvXCI7XHJcblx0XHRuZXVDb25mLmNsaS5yZXNvdXJjZXNQYXRoID0gXCIvXCI7XHJcblx0XHRuZXVDb25mLm1vZGVzLndpbmRvdy5pY29uID0gXCIvd2ViL2ljb24ucG5nXCI7XHJcblx0fSBlbHNlIHtcclxuXHRcdG5ldUNvbmYudG9rZW5TZWN1cml0eSA9ICdub25lJztcclxuXHR9XHJcblxyXG5cdG5ldUNvbmYubmF0aXZlQWxsb3dMaXN0ID0gWy4uLm5ldUNvbmYubmF0aXZlQWxsb3dMaXN0LCAuLi5uZXV0cmFsaW5vLmFsbG93XTtcclxuXHJcblx0d3JpdGVGaWxlU3luYyhpc1Byb2QgPyAnZGlzdC9uZXV0cmFsaW5vLmNvbmZpZy5qc29uJyA6ICduZXV0cmFsaW5vLmNvbmZpZy5qc29uJywgSlNPTi5zdHJpbmdpZnkobmV1Q29uZikpO1xyXG5cdHdyaXRlRmlsZVN5bmMoJy4vc3JjL3B1YmxpYy9fX25ldXRyYWxpbm9fZ2xvYmFscy5qcycsICcvLyBEdW1teSBmaWxlJyk7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxuZXUtYnVpbGQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1bWllL0Rlc2t0b3AvSVNGR2FtZS9jaG9jby1qYW0tdGVtcGxhdGUvYXV0b21hdGlvbi9uZXUtYnVpbGQudHNcIjtpbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IFdyaXRlTmV1Q29uZmlnIGZyb20gJy4vd3JpdGUtbmV1LWNvbmZpZyc7XHJcbmltcG9ydCB7IGNyZWF0ZVBhY2thZ2UgfSBmcm9tICdAZWxlY3Ryb24vYXNhcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuZXVCdWlsZCgpOiBQbHVnaW5PcHRpb24ge1xyXG5cdHJldHVybiB7XHJcblx0XHRuYW1lOiAnbmV1LWJ1aWxkJyxcclxuXHRcdGFwcGx5OiAnYnVpbGQnLFxyXG5cdFx0ZW5mb3JjZTogJ3ByZScsXHJcblx0XHRhc3luYyBjbG9zZUJ1bmRsZSgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0J1aWxkaW5nIGdhbWUgYXBwJyk7XHJcblx0XHRcdFdyaXRlTmV1Q29uZmlnKHRydWUpO1xyXG5cdFx0XHRhd2FpdCBjcmVhdGVQYWNrYWdlKCdkaXN0JywgJ2Jpbi9yZXNvdXJjZXMubmV1Jyk7XHJcblx0XHR9LFxyXG5cdH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxuZXUtaW5qZWN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL2F1dG9tYXRpb24vbmV1LWluamVjdC50c1wiO2ltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcblxyXG5jb25zdCB0cnlDYXRjaCA9IDxUPihmdW46ICgpID0+IFQsIGZhbGxiYWNrOiBUKTogVCA9PiB7XHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBmdW4oKTtcclxuXHR9IGNhdGNoKGUpIHtcclxuXHRcdHJldHVybiBmYWxsYmFjaztcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdldEdsb2JhbHNQYXRoID0gKCkgPT4ge1xyXG5cdGNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50JztcclxuXHRjb25zdCBhdXRoSW5mbyA9IEpTT04ucGFyc2UodHJ5Q2F0Y2goKCkgPT4gcmVhZEZpbGVTeW5jKCcudG1wL2F1dGhfaW5mby5qc29uJykudG9TdHJpbmcoKSwgJ3t9JykpO1xyXG5cdGNvbnN0IHBvcnQgPSBhdXRoSW5mby5ubFBvcnQ7XHJcblx0cmV0dXJuIGAkeyhpc0RldiAmJiBwb3J0KSA/IGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vYCA6ICcnfV9fbmV1dHJhbGlub19nbG9iYWxzLmpzYFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuZXVJbmplY3QoKTogUGx1Z2luT3B0aW9uIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ25ldS1pbmplY3QnLFxyXG5cdFx0dHJhbnNmb3JtSW5kZXhIdG1sOiAoaHRtbCkgPT4ge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0dGFnczogW3tcclxuXHRcdFx0XHRcdHRhZzogJ3NjcmlwdCcsXHJcblx0XHRcdFx0XHRpbmplY3RUbzogJ2hlYWQtcHJlcGVuZCcsXHJcblx0XHRcdFx0XHRhdHRyczoge1xyXG5cdFx0XHRcdFx0XHRzcmM6IGdldEdsb2JhbHNQYXRoKClcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fV1cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5cclxuXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVtaWVcXFxcRGVza3RvcFxcXFxJU0ZHYW1lXFxcXGNob2NvLWphbS10ZW1wbGF0ZVxcXFxhdXRvbWF0aW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cXFxcd2luLWJ1bmRsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTHVtaWUvRGVza3RvcC9JU0ZHYW1lL2Nob2NvLWphbS10ZW1wbGF0ZS9hdXRvbWF0aW9uL3dpbi1idW5kbGUudHNcIjtpbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgdGl0bGUsIHRpdGxlX2Rhc2hlZCwgZ2FtZV9kaXIsIGJ1aWxkX3BhdGgsIGdpdF9jb3VudCwgZGVzY3JpcHRpb24sIGdpdF92ZXJzaW9uLCB0ZWFtIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBta2RpclN5bmMsIGNvcHlGaWxlU3luYywgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBOdEV4ZWN1dGFibGUsIE50RXhlY3V0YWJsZVJlc291cmNlLCBEYXRhLCBSZXNvdXJjZSB9IGZyb20gJ3Jlc2VkaXQnO1xyXG5pbXBvcnQgcG5nVG9JY28gZnJvbSAncG5nLXRvLWljbyc7XHJcblxyXG5jb25zdCBCdW5kbGVXaW5BcHAgPSBhc3luYyAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coYFBhY2thZ2luZyBXaW5kb3dzIGV4ZS4uLmApO1xyXG5cclxuXHRjb25zdCBvdXRfZGlyID0gYC4vZGlzdC93aW4vJHt0aXRsZV9kYXNoZWR9YDtcclxuXHJcblx0bWtkaXJTeW5jKCcuL2Rpc3Qvd2luJyk7XHJcblx0bWtkaXJTeW5jKG91dF9kaXIpO1xyXG5cdGNvcHlGaWxlU3luYyhgYmluL3Jlc291cmNlcy5uZXVgLCBgJHtvdXRfZGlyfS9yZXNvdXJjZXMubmV1YCk7XHJcblxyXG5cdGNvbnN0IGRhdGEgPSByZWFkRmlsZVN5bmMoYGJpbi9uZXV0cmFsaW5vLXdpbl94NjQuZXhlYCk7XHJcblx0Y29uc3QgZXhlID0gTnRFeGVjdXRhYmxlLmZyb20oZGF0YSk7XHJcblx0Y29uc3QgcmVzID0gTnRFeGVjdXRhYmxlUmVzb3VyY2UuZnJvbShleGUpO1xyXG5cclxuXHRjb25zdCBwbmdEYXRhID0gcmVhZEZpbGVTeW5jKCcuL3NyYy9wdWJsaWMvaWNvbi5wbmcnKTtcclxuXHRjb25zdCBpY29uRmlsZSA9IERhdGEuSWNvbkZpbGUuZnJvbShhd2FpdCBwbmdUb0ljbyhwbmdEYXRhKSk7XHJcblx0UmVzb3VyY2UuSWNvbkdyb3VwRW50cnkucmVwbGFjZUljb25zRm9yUmVzb3VyY2UoXHJcblx0XHRyZXMuZW50cmllcywgMTAxLCAxMDMzLFxyXG5cdFx0aWNvbkZpbGUuaWNvbnMubWFwKChpdGVtKSA9PiBpdGVtLmRhdGEpXHJcblx0KTtcclxuXHJcblx0Y29uc3QgdmkgPSBSZXNvdXJjZS5WZXJzaW9uSW5mby5jcmVhdGVFbXB0eSgpO1xyXG5cdHZpLnNldEZpbGVWZXJzaW9uKDAsIDAsIE51bWJlcihnaXRfY291bnQpLCAwLCAxMDMzKTtcclxuXHR2aS5zZXRTdHJpbmdWYWx1ZXMoXHJcblx0XHR7IGxhbmc6IDEwMzMsIGNvZGVwYWdlOiAxMjAwIH0sXHJcblx0XHR7XHJcblx0XHRcdEZpbGVEZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcblx0XHRcdFByb2R1Y3ROYW1lOiBgJHt0aXRsZX0gYnkgJHt0ZWFtfWAsXHJcblx0XHRcdFByb2R1Y3RWZXJzaW9uOiBnaXRfdmVyc2lvbixcclxuXHRcdFx0Q29tcGFueU5hbWU6IHRlYW0sXHJcblx0XHR9XHJcblx0KTtcclxuXHR2aS5vdXRwdXRUb1Jlc291cmNlRW50cmllcyhyZXMuZW50cmllcyk7XHJcblxyXG5cdHJlcy5vdXRwdXRSZXNvdXJjZShleGUpO1xyXG5cdHdyaXRlRmlsZVN5bmMoYCR7b3V0X2Rpcn0vJHt0aXRsZX0uZXhlYCwgQnVmZmVyLmZyb20oZXhlLmdlbmVyYXRlKCkpKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1bmRsZVdpbkFwcCgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ2J1aWxkLXdpbmRvd3MtYnVuZGxlJyxcclxuXHRcdGFwcGx5OiAnYnVpbGQnLFxyXG5cdFx0ZW5mb3JjZTogJ3ByZScsXHJcblx0XHRjbG9zZUJ1bmRsZToge1xyXG5cdFx0XHRoYW5kbGVyOiBCdW5kbGVXaW5BcHAsXHJcblx0XHRcdHNlcXVlbnRpYWw6IHRydWVcclxuXHRcdH0sXHJcblx0fSBhcyBQbHVnaW5PcHRpb247XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxtYWMtYnVuZGxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL2F1dG9tYXRpb24vbWFjLWJ1bmRsZS50c1wiO2ltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyB0ZWFtLCB0aXRsZSwgZ2l0X2NvdW50LCBnaXRfdmVyc2lvbiwgdGVhbV9kYXNoZWQsXHJcblx0XHR0aXRsZV9kYXNoZWQsIGdhbWVfZGlyLCBidWlsZF9wYXRoLCB5ZWFyX2NvcHlyaWdodCB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuaW1wb3J0IHsgbWtkaXJTeW5jLCB3cml0ZUZpbGVTeW5jLCBjb3B5RmlsZVN5bmMsIHJlbmFtZVN5bmMgfSBmcm9tICdmcyc7XHJcblxyXG5jb25zdCBCdW5kbGVNYWNBcHAgPSAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coYFBhY2thZ2luZyBNYWMgZG1nLi4uYCk7XHJcblxyXG5cdGNvbnN0IGJvb3RzdHJhcHBlciA9IGAjIS91c3IvYmluL2VudiBiYXNoXHJcbk1BQ09TPVwiXFwkKCBjZCAtLSBcIiQoIGRpcm5hbWUgLS0gXCJcXCR7QkFTSF9TT1VSQ0VbMF19XCIgKVwiICY+IC9kZXYvbnVsbCAmJiBwd2QgKVwiXHJcbkNPTlRFTlRTPVwiJChkaXJuYW1lIFwiJE1BQ09TXCIpXCJcclxuZXhlYyBcIlxcJHtNQUNPU30vZ2FtZVwiIC0tcGF0aD1cIlxcJHtDT05URU5UU30vUmVzb3VyY2VzXCIgLS1lbmFibGUtZXh0ZW5zaW9ucz10cnVlYDtcclxuXHJcblx0Y29uc3QgcGxpc3QgPSBgPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+XHJcbjwhRE9DVFlQRSBwbGlzdCBQVUJMSUMgXCItLy9BcHBsZSBDb21wdXRlci8vRFREIFBMSVNUIDEuMC8vRU5cIiBcImh0dHA6Ly93d3cuYXBwbGUuY29tL0RURHMvUHJvcGVydHlMaXN0LTEuMC5kdGRcIj5cclxuPHBsaXN0IHZlcnNpb249XCIxLjBcIj5cclxuPGRpY3Q+XHJcbiAgPGtleT5OU0h1bWFuUmVhZGFibGVDb3B5cmlnaHQ8L2tleT5cclxuICA8c3RyaW5nPiR7dGl0bGV9ICR7Z2l0X3ZlcnNpb259IFx1MDBBOSAke3RlYW19ICR7eWVhcl9jb3B5cmlnaHR9PC9zdHJpbmc+XHJcbiAgPGtleT5DRkJ1bmRsZUV4ZWN1dGFibGU8L2tleT5cclxuICA8c3RyaW5nPmJvb3RzdHJhcHBlcjwvc3RyaW5nPlxyXG4gIDxrZXk+Q0ZCdW5kbGVJZGVudGlmaWVyPC9rZXk+XHJcbiAgPHN0cmluZz5jb20uJHt0ZWFtX2Rhc2hlZH0uJHt0aXRsZV9kYXNoZWR9PC9zdHJpbmc+XHJcbiAgPGtleT5DRkJ1bmRsZU5hbWU8L2tleT5cclxuICA8c3RyaW5nPiR7dGl0bGV9PC9zdHJpbmc+XHJcbiAgPGtleT5DRkJ1bmRsZUljb25GaWxlPC9rZXk+XHJcbiAgPHN0cmluZz5pY29uLnBuZzwvc3RyaW5nPlxyXG4gIDxrZXk+Q0ZCdW5kbGVTaG9ydFZlcnNpb25TdHJpbmc8L2tleT5cclxuICA8c3RyaW5nPjAuJHtnaXRfY291bnR9PC9zdHJpbmc+XHJcbiAgPGtleT5DRkJ1bmRsZUluZm9EaWN0aW9uYXJ5VmVyc2lvbjwva2V5PlxyXG4gIDxzdHJpbmc+Ni4wPC9zdHJpbmc+XHJcbiAgPGtleT5DRkJ1bmRsZVBhY2thZ2VUeXBlPC9rZXk+XHJcbiAgPHN0cmluZz5BUFBMPC9zdHJpbmc+XHJcbiAgPGtleT5JRk1ham9yVmVyc2lvbjwva2V5PlxyXG4gIDxpbnRlZ2VyPjA8L2ludGVnZXI+XHJcbiAgPGtleT5JRk1pbm9yVmVyc2lvbjwva2V5PlxyXG4gIDxpbnRlZ2VyPiR7Z2l0X2NvdW50fTwvaW50ZWdlcj5cclxuPC9kaWN0PlxyXG48L3BsaXN0PmA7XHJcblxyXG5cdGNvbnN0IG91dF9kaXIgPSBgLi9kaXN0L21hYy8ke3RpdGxlfWA7XHJcblxyXG5cdG1rZGlyU3luYyhgLi9kaXN0L21hYy9gKTtcclxuXHRta2RpclN5bmMob3V0X2Rpcik7XHJcblx0bWtkaXJTeW5jKGAke291dF9kaXJ9L0NvbnRlbnRzYCk7XHJcblx0bWtkaXJTeW5jKGAke291dF9kaXJ9L0NvbnRlbnRzL01hY09TYCk7XHJcblx0bWtkaXJTeW5jKGAke291dF9kaXJ9L0NvbnRlbnRzL1Jlc291cmNlc2ApO1xyXG5cclxuXHR3cml0ZUZpbGVTeW5jKGAke291dF9kaXJ9L0NvbnRlbnRzL01hY09TL2Jvb3RzdHJhcHBlcmAsIGJvb3RzdHJhcHBlcik7XHJcblx0d3JpdGVGaWxlU3luYyhgJHtvdXRfZGlyfS9Db250ZW50cy9pbmZvLnBsaXN0YCwgcGxpc3QpO1xyXG5cdGNvcHlGaWxlU3luYyhgYmluL25ldXRyYWxpbm8tbWFjX3VuaXZlcnNhbGAsIGAke291dF9kaXJ9L0NvbnRlbnRzL01hY09TL2dhbWVgKTtcclxuXHRjb3B5RmlsZVN5bmMoYGJpbi9yZXNvdXJjZXMubmV1YCwgYCR7b3V0X2Rpcn0vQ29udGVudHMvUmVzb3VyY2VzL3Jlc291cmNlcy5uZXVgKTtcclxuXHRjb3B5RmlsZVN5bmMoYC4vc3JjL3B1YmxpYy9pY29uLnBuZ2AsIGAke291dF9kaXJ9L0NvbnRlbnRzL1Jlc291cmNlcy9pY29uLnBuZ2ApO1xyXG5cdHJlbmFtZVN5bmMob3V0X2RpciwgYCR7b3V0X2Rpcn0uYXBwYCk7XHJcblxyXG5cdHRyeSB7XHJcblx0XHRleGVjU3luYyhgbWtpc29mcyAtSiAtUiAtbyAuL2Rpc3QvJHt0aXRsZV9kYXNoZWR9LW1hYy5kbWcgLW1hYy1uYW1lIC1WIFwiJHt0aXRsZX1cIiAtYXBwbGUgLXYgLWRpci1tb2RlIDc3NyAtZmlsZS1tb2RlIDc3NyBcIi4vZGlzdC9tYWMvXCJgKTtcclxuXHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gYnVpbGQgZG1nYCk7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVuZGxlTWFjQXBwKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRuYW1lOiAnYnVpbGQtbWFjLWJ1bmRsZScsXHJcblx0XHRhcHBseTogJ2J1aWxkJyxcclxuXHRcdGNsb3NlQnVuZGxlOiBCdW5kbGVNYWNBcHAsXHJcblx0fSBhcyBQbHVnaW5PcHRpb247XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxsaW51eC1idW5kbGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1bWllL0Rlc2t0b3AvSVNGR2FtZS9jaG9jby1qYW0tdGVtcGxhdGUvYXV0b21hdGlvbi9saW51eC1idW5kbGUudHNcIjtpbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgdGl0bGVfZGFzaGVkLCBnYW1lX2RpciwgYnVpbGRfcGF0aCB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgbWtkaXJTeW5jLCBjb3B5RmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcblxyXG5jb25zdCBCdW5kbGVMaW51eEFwcCA9ICgpID0+IHtcclxuXHRjb25zb2xlLmxvZyhgUGFja2FnaW5nIExpbnV4IGFwcC4uLmApO1xyXG5cclxuXHRjb25zdCBvdXRfZGlyID0gYC4vZGlzdC9saW51eC8ke3RpdGxlX2Rhc2hlZH1gO1xyXG5cclxuXHRta2RpclN5bmMoJy4vZGlzdC9saW51eCcpO1xyXG5cdG1rZGlyU3luYyhvdXRfZGlyKTtcclxuXHJcblx0Y29weUZpbGVTeW5jKGBiaW4vbmV1dHJhbGluby1saW51eF94NjRgLCBgJHtvdXRfZGlyfS8ke3RpdGxlX2Rhc2hlZH0teDY0YCk7XHJcblx0Y29weUZpbGVTeW5jKGBiaW4vbmV1dHJhbGluby1saW51eF9hcm02NGAsIGAke291dF9kaXJ9LyR7dGl0bGVfZGFzaGVkfS1hcm02NGApO1xyXG5cdGNvcHlGaWxlU3luYyhgYmluL25ldXRyYWxpbm8tbGludXhfYXJtaGZgLCBgJHtvdXRfZGlyfS8ke3RpdGxlX2Rhc2hlZH0tYXJtaGZgKTtcclxuXHRjb3B5RmlsZVN5bmMoYGJpbi9yZXNvdXJjZXMubmV1YCwgYCR7b3V0X2Rpcn0vcmVzb3VyY2VzLm5ldWApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVuZGxlTGludXhBcHAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdG5hbWU6ICdidWlsZC1saW51eC1idW5kbGUnLFxyXG5cdFx0YXBwbHk6ICdidWlsZCcsXHJcblx0XHRjbG9zZUJ1bmRsZTogQnVuZGxlTGludXhBcHAsXHJcblx0fSBhcyBQbHVnaW5PcHRpb247XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdW1pZVxcXFxEZXNrdG9wXFxcXElTRkdhbWVcXFxcY2hvY28tamFtLXRlbXBsYXRlXFxcXGF1dG9tYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1bWllXFxcXERlc2t0b3BcXFxcSVNGR2FtZVxcXFxjaG9jby1qYW0tdGVtcGxhdGVcXFxcYXV0b21hdGlvblxcXFxidWlsZC1jbGVhbnVwLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MdW1pZS9EZXNrdG9wL0lTRkdhbWUvY2hvY28tamFtLXRlbXBsYXRlL2F1dG9tYXRpb24vYnVpbGQtY2xlYW51cC50c1wiO2ltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyByaW1yYWZTeW5jIH0gZnJvbSAncmltcmFmJztcclxuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcclxuaW1wb3J0IHsgYnVpbGRfcGF0aCwgdGl0bGVfZGFzaGVkIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5cclxuY29uc3QgQnVpbGRDbGVhbnVwID0gKCkgPT4ge1xyXG5cdHJpbXJhZlN5bmMoYnVpbGRfcGF0aCk7XHJcblx0cmltcmFmU3luYygnLi9kaXN0L25ldXRyYWxpbm8uY29uZmlnLmpzb24nKTtcclxuXHRyaW1yYWZTeW5jKCcuL25ldXRyYWxpbm8uY29uZmlnLmpzb24nKTtcclxuXHR3cml0ZUZpbGVTeW5jKCcuL2Rpc3QvbWV0YS5qc29uJywgSlNPTi5zdHJpbmdpZnkoe3RpdGxlOiB0aXRsZV9kYXNoZWR9KSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkQ2xlYW51cCgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ2J1aWxkLWNsZWFudXAnLFxyXG5cdFx0YXBwbHk6ICdidWlsZCcsXHJcblx0XHRlbmZvcmNlOiAncG9zdCcsXHJcblx0XHRjbG9zZUJ1bmRsZTogQnVpbGRDbGVhbnVwLFxyXG5cdH0gYXMgUGx1Z2luT3B0aW9uO1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVYsU0FBUyxvQkFBb0I7QUFFOVcsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTtBQUNwQixPQUFPLG1CQUFtQjs7O0FDSDFCLFNBQVMscUJBQXFCOzs7QUNEa1YsU0FBUyxnQkFBZ0I7QUFDelksU0FBUyxnQkFBZ0I7OztBQ0F4QixXQUFRO0FBQ1IsWUFBUztBQUNULGtCQUFlO0FBTWYsaUJBQWM7QUFBQSxFQUNiLE9BQVMsQ0FBQyxZQUFZLGVBQWU7QUFDdEM7OztBRExELElBQU0sV0FBVyxDQUFJLEtBQWMsYUFBbUI7QUFDckQsTUFBSTtBQUNILFdBQU8sSUFBSTtBQUFBLEVBQ1osU0FBUSxHQUFHO0FBQ1YsV0FBTztBQUFBLEVBQ1I7QUFDRDtBQUVPLElBQU0sWUFBWSxTQUFTLE1BQU0sU0FBUywyQkFBMkIsRUFBRSxTQUFTLEVBQUUsS0FBSyxHQUFHLElBQUk7QUFDOUYsSUFBTSxZQUFZLFNBQVMsTUFBTSxTQUFTLDRCQUE0QixFQUFFLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUTtBQUNuRyxJ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Z0M7QUFDdEMsU0FBTztBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLEVBQ2Q7QUFDRDs7O0FaSEEsSUFBTyxzQkFBUSxNQUFNO0FBQ3BCLFVBQVEsSUFBSSxrQkFBa0I7QUFDOUIsVUFBUSxJQUFJLGlCQUFpQjtBQUM3QixVQUFRLElBQUksd0JBQXdCO0FBRXBDLFNBQU8sYUFBYTtBQUFBLElBQ25CLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNSLGNBQWM7QUFBQSxNQUNkLGdCQUFjO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDUCxZQUFZO0FBQUEsTUFDYixDQUFDO0FBQUEsTUFDRCw0QkFBa0I7QUFBQSxNQUNsQixVQUFVO0FBQUEsTUFDVixTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsTUFDZixJQUFJO0FBQUEsUUFDSCxPQUFPO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixhQUFhLEdBQUcsWUFBWTtBQUFBLE1BQzdCLENBQUM7QUFBQSxNQUNELElBQUk7QUFBQSxRQUNILE9BQU87QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLGFBQWEsR0FBRyxZQUFZO0FBQUEsTUFDN0IsQ0FBQztBQUFBLE1BQ0QsSUFBSTtBQUFBLFFBQ0gsT0FBTztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsYUFBYSxHQUFHLFlBQVk7QUFBQSxNQUM3QixDQUFDO0FBQUEsTUFDRCxhQUFhO0FBQUEsSUFDZDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsdUJBQXVCO0FBQUEsTUFDdkIsbUJBQW1CO0FBQUEsTUFDbkIsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2QsUUFBUTtBQUFBLFVBQ1AsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1A7QUFBQSxFQUNELENBQUM7QUFDRjsiLAogICJuYW1lcyI6IFsid3JpdGVGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgInRyeUNhdGNoIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgImV4ZWNTeW5jIiwgIm1rZGlyU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgImNvcHlGaWxlU3luYyIsICJta2RpclN5bmMiLCAid3JpdGVGaWxlU3luYyIsICJjb3B5RmlsZVN5bmMiLCAiZXhlY1N5bmMiLCAibWtkaXJTeW5jIiwgImNvcHlGaWxlU3luYyIsICJta2RpclN5bmMiLCAiY29weUZpbGVTeW5jIiwgIndyaXRlRmlsZVN5bmMiLCAid3JpdGVGaWxlU3luYyJdCn0K
