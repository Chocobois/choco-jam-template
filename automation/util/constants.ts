import { execSync } from 'child_process';
import { team, title } from '../../game.config.json';

export { team, title };

export const git_count = execSync('git rev-list --count HEAD').toString().trim();
export const git_short = execSync('git rev-parse --short HEAD').toString().trim();
export const git_version = `v${git_count}.${git_short}`;

export const team_dashed = team.toLowerCase().replace(/\s/gi, '-');
export const title_dashed = title.toLowerCase().replace(/\s/gi, '-');
export const game_dir = `${team_dashed}-${title_dashed}`;
export const build_path = `./dist/${game_dir}/`;
