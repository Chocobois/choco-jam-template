import { PluginOption } from 'vite';
import { team, title } from '../game.config.json';
import { mkdirSync, copyFileSync } from 'fs';

const BuildMacApp = () => {
	console.log(`Building Windows exe...`);
	const teamId = team.toLowerCase().replace(/\s/gi, '-');
	const appId = title.toLowerCase().replace(/\s/gi, '-');
	const buildName = `${teamId}-${appId}`;

	const winDir = `./dist/win/${title}`;
	const buildPath = `./dist/${buildName}/`;

	mkdirSync('./dist/win');
	mkdirSync(winDir);
	copyFileSync(`${buildPath}/${buildName}-win_x64.exe`, `${winDir}/${title}.exe`);
	copyFileSync(`${buildPath}/resources.neu`, `${winDir}/resources.neu`);
};

export default function buildWinApp() {
	return {
		name: 'build-windows-bundle',
		closeBundle: BuildMacApp,
	} as PluginOption;
}
