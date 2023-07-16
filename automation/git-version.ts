import { PluginOption } from 'vite';
import { writeFileSync } from 'fs';
import { git_count, git_short, git_version } from './util/constants';

const WriteGitVersion = () => {
    writeFileSync('./src/version.json', JSON.stringify({
        count: git_count,
        short: git_short,
        version: git_version
    }));
}

export default function writeGitVersion() {
    return {
        name: 'Write Git short version',
        buildStart: WriteGitVersion
    } as PluginOption;
}
