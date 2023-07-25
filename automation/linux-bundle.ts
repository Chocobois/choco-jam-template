import { PluginOption } from 'vite';
import { title_dashed, game_dir, build_path } from './constants';
import { mkdirSync, copyFileSync } from 'fs';

const BuildWinApp = () => {
	console.log(`Packaging Linux app...`);

	const out_dir = `./dist/linux/${title_dashed}`;

	mkdirSync('./dist/linux');
	mkdirSync(out_dir);

	copyFileSync(`${build_path}/${game_dir}-linux_x64`, `${out_dir}/${title_dashed}-x64`);
	copyFileSync(`${build_path}/${game_dir}-linux_arm64`, `${out_dir}/${title_dashed}-arm64`);
	copyFileSync(`${build_path}/${game_dir}-linux_armhf`, `${out_dir}/${title_dashed}-armhf`);
	copyFileSync(`${build_path}/resources.neu`, `${out_dir}/resources.neu`);
};

export default function buildWinApp() {
	return {
		name: 'build-linux-bundle',
		apply: 'build',
		closeBundle: BuildWinApp,
	} as PluginOption;
}
