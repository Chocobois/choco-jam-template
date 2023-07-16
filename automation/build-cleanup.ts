import { PluginOption } from 'vite';
import { rimrafSync } from 'rimraf';
import { team, title } from '../game.config.json';

export default function buildCleanup() {
	return {
		name: 'build-cleanup',
		apply: 'build',
		closeBundle: () => {
			const teamId = team.toLowerCase().replace(/\s/gi, '-');
			const appId = title.toLowerCase().replace(/\s/gi, '-');
			const buildName = `${teamId}-${appId}`;
			rimrafSync(`./dist/${buildName}`);
		},
	} as PluginOption;
}
