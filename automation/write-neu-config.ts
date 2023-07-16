import { execSync } from 'child_process';
import { team, title } from '../game.config.json';
import neuConf from './neu-template.json';
import { writeFileSync } from 'fs';

export default function WriteNeuConfig() {
	const count = execSync('git rev-list --count HEAD').toString().trim();

	const teamId = team.toLowerCase().replace(/\s/gi, '-');
	const appId = title.toLowerCase().replace(/\s/gi, '-');

	neuConf.applicationId = `${teamId}.${appId}`;
	neuConf.modes.window.title = `${team} - ${title}`;
	neuConf.cli.binaryName = `${teamId}-${appId}`;
	neuConf.version = `0.0.${count}`;

	writeFileSync('neutralino.config.json', JSON.stringify(neuConf));
}
