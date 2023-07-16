import { PluginOption } from 'vite';
import { title, title_dashed, game_dir, build_path } from './util/constants';
import { mkdirSync, copyFileSync } from 'fs';

const BuildMacApp = () => {
	console.log(`Packaging Windows exe...`);

	const out_dir = `./dist/win/${title_dashed}`;

	mkdirSync('./dist/win');
	mkdirSync(out_dir);
	copyFileSync(`${build_path}/${game_dir}-win_x64.exe`, `${out_dir}/${title}.exe`);
	copyFileSync(`${build_path}/resources.neu`, `${out_dir}/resources.neu`);
};

export default function buildWinApp() {
	return {
		name: 'build-windows-bundle',
		closeBundle: BuildMacApp,
		apply: 'build',
	} as PluginOption;
}
