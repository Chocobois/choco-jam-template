import { PluginOption } from 'vite';
import { team, title } from '../game.config.json';
import { mkdirSync, copyFileSync } from 'fs';

const BuildWinApp = () => {
	console.log(`Building Linux app...`);
	const teamId = team.toLowerCase().replace(/\s/gi, '-');
	const appId = title.toLowerCase().replace(/\s/gi, '-');
	const buildName = `${teamId}-${appId}`;

	const linDir = `./dist/linux/${appId}`;
	const buildPath = `./dist/${buildName}/`;

	mkdirSync('./dist/linux');
	mkdirSync(linDir);
	copyFileSync(`${buildPath}/${buildName}-linux_x64`, `${linDir}/${appId}-x64`);
	copyFileSync(`${buildPath}/${buildName}-linux_arm64`, `${linDir}/${appId}-arm64`);
	copyFileSync(`${buildPath}/${buildName}-linux_armhf`, `${linDir}/${appId}-armhf`);
	copyFileSync(`${buildPath}/resources.neu`, `${linDir}/resources.neu`);
};

export default function buildWinApp() {
	return {
		name: 'build-linux-bundle',
		closeBundle: BuildWinApp,
	} as PluginOption;
}
