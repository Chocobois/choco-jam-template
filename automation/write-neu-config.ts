import { team, title, team_dashed, title_dashed, git_count } from './util/constants';
import neuConf from './neu-template.json';
import { writeFileSync } from 'fs';

export default function WriteNeuConfig() {
	neuConf.applicationId = `${team_dashed}.${title_dashed}`;
	neuConf.modes.window.title = `${title} by ${team}`;
	neuConf.cli.binaryName = `${team_dashed}-${title_dashed}`;
	neuConf.version = `0.0.${git_count}`;

	writeFileSync('neutralino.config.json', JSON.stringify(neuConf));
}
