import { PluginOption } from 'vite';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const WriteGitVersion = () => {
    const short = execSync('git rev-parse --short HEAD');
    const count = execSync('git rev-list --count HEAD');
    const out = {
        version: short.toString().trim(),
        revision: count.toString().trim()
    }
    writeFileSync('./src/version.json', JSON.stringify(out));
}

export default function getGitVersion() {
    return {
        name: 'Write Git short version',
        buildStart: WriteGitVersion
    } as PluginOption;
}
