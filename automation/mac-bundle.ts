import { PluginOption } from 'vite';
import { team, title, git_count, git_version, team_dashed, 
		 title_dashed, game_dir, build_path } from './util/constants';
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, copyFileSync, renameSync } from 'fs';

const BuildMacApp = () => {
	console.log(`Packaging Mac dmg...`);

	const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSHumanReadableCopyright</key>
  <string>${title} ${git_version} © ${team}</string>
  <key>CFBundleExecutable</key>
  <string>game</string>
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

	mkdirSync(`./dist/mac/`);
	mkdirSync(out_dir);
	mkdirSync(`${out_dir}/Contents`);
	mkdirSync(`${out_dir}/Contents/MacOS`);
	mkdirSync(`${out_dir}/Contents/Resources`);

	writeFileSync(`${out_dir}/Contents/info.plist`, plist);
	copyFileSync(`${build_path}/${game_dir}-mac_universal`, `${out_dir}/Contents/MacOS/game`);
	copyFileSync(`${build_path}/resources.neu`, `${out_dir}/Contents/MacOS/resources.neu`);
	copyFileSync(`./src/public/icon.png`, `${out_dir}/Contents/Resources/icon.png`);
	renameSync(out_dir, `${out_dir}.app`);

	try {
		execSync(`mkisofs -J -R -o ./dist/game-mac.dmg -mac-name -V "${title}" -apple -v -dir-mode 777 -file-mode 777 "./dist/mac/"`);
	} catch (err) {
		console.log(`Failed to build dmg`);
	}
};

export default function buildMacApp() {
	return {
		name: 'build-mac-bundle',
		apply: 'build',
		closeBundle: BuildMacApp,
	} as PluginOption;
}
