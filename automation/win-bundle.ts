import { PluginOption } from 'vite';
import { title, title_dashed, game_dir, build_path } from './util/constants';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { NtExecutable, NtExecutableResource, Data, Resource } from 'resedit';
import pngToIco from 'png-to-ico';

const BuildWinApp = async () => {
	console.log(`Packaging Windows exe...`);

	const out_dir = `./dist/win/${title_dashed}`;

	mkdirSync('./dist/win');
	mkdirSync(out_dir);
	copyFileSync(`${build_path}/resources.neu`, `${out_dir}/resources.neu`);

	const data = readFileSync(`${build_path}/${game_dir}-win_x64.exe`);
	const exe = NtExecutable.from(data);
	const res = NtExecutableResource.from(exe);
	const pngData = readFileSync('./src/public/icon.png');
	const iconData = await pngToIco(pngData);
	const iconFile = Data.IconFile.from(iconData);

	Resource.IconGroupEntry.replaceIconsForResource(
		res.entries,
		101,
		1003,
		iconFile.icons.map((item) => item.data)
	)
	res.outputResource(exe);

	writeFileSync(`${out_dir}/${title}.exe`, Buffer.from(exe.generate()));
};

export default function buildWinApp() {
	return {
		name: 'build-windows-bundle',
		apply: 'build',
		enforce: 'pre',
		closeBundle: {
			handler: BuildWinApp,
			sequential: true
		},
	} as PluginOption;
}
