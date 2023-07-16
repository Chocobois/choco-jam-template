import { PluginOption } from 'vite';
import { rimrafSync } from 'rimraf';
import { build_path } from './util/constants';

export default function buildCleanup() {
	return {
		name: 'build-cleanup',
		apply: 'build',
		closeBundle: () => {
			rimrafSync(build_path);
		},
	} as PluginOption;
}
