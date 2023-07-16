import { execSync } from 'child_process';
import { PluginOption } from 'vite';
import WriteNeuConfig from './write-neu-config';

export default function neuBuild(): PluginOption {
	return {
		name: 'neu-build',
		apply: 'build',
		closeBundle() {
			console.log('Building standalone app');
			WriteNeuConfig();
			execSync('neu build');
		},
	};
}
