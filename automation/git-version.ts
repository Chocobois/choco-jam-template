import { PluginOption } from 'vite';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const WriteGitVersion = () => {
    const count = execSync('git rev-list --count HEAD').toString().trim();
    const short = execSync('git rev-parse --short HEAD').toString().trim();
    const version = `v${count}.${short}`;
    writeFileSync('./src/version.json', JSON.stringify({count, short, version}));
}

export default function getGitVersion() {
    return {
        name: 'Write Git short version',
        buildStart: WriteGitVersion
    } as PluginOption;
}
