import { PluginOption } from 'vite';
import { readFileSync } from 'fs';

export default function neuInject(): PluginOption {
	return {
		name: 'neu-inject',
		transformIndexHtml: (html) => {
			if(process.env.NODE_ENV == 'development') {
				try {
					const authInfo = JSON.parse(readFileSync('.tmp/auth_info.json').toString());
					return {
						html,
						tags: [{
							tag: 'script',
							injectTo: 'head-prepend',
							attrs: {
								src: `http://localhost:${authInfo.port}/__neutralino_globals.js`
							}
						}]
					};
				} catch(e) {
				}
			}

			return {
				html,
				tags: [{
					tag: 'script',
					attrs: {
						src: '__neutralino_globals.js'
					},
					injectTo: 'head-prepend',
				}]
			};
		}
	};
}



