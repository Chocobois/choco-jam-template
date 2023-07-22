import { execSync } from 'child_process';
import { platform } from 'os';
import { team, title, description } from '../../game.config.json';

export { team, title, description };

export const git_count = execSync('git rev-list --count HEAD').toString().trim();
export const git_short = execSync('git rev-parse --short HEAD').toString().trim();
export const git_version = `v${git_count}.${git_short}`;

export const year_initial = Number( platform() == 'win32'
		? execSync('git log --reverse | findstr "Date"').toString().match(/(\d+) \+/)?.[1]
		: execSync('git log --reverse | grep "Date" -m 1').toString().match(/(\d+) \+/)?.[1]
);
export const year_current = new Date().getFullYear();
export const year_copyright = year_initial == year_current 
		? `${year_initial}` : `${year_initial} - ${year_current}`;

export const team_dashed = team.toLowerCase().replace(/\s/gi, '-');
export const title_dashed = title.toLowerCase().replace(/\s/gi, '-');
export const game_dir = `${team_dashed}-${title_dashed}`;
export const build_path = `./dist/${game_dir}/`;