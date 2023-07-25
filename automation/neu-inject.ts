import { PluginOption } from 'vite';

export default function neuInject(): PluginOption {
	return {
		name: 'neu-inject',
        transformIndexHtml: (html) => ({
            html,
            tags: [{
                tag: 'script',
                attrs: {
                    src: '__neutralino_globals.js'
                },
                injectTo: 'head-prepend',
            }]
        })
	};
}



