import * as fs from 'fs/promises';
import { WorkerPool } from '@intrnl/node-worker-pool';

import type { PluginOptions, PluginWorker } from './types/plugin';

import type { SnowpackPlugin, SnowpackConfig } from 'snowpack';

import { preprocess } from 'svelte/compiler';
import svelteRollupPlugin from 'rollup-plugin-svelte';


let workerScript = require.resolve('../worker');

function plugin (snowpackConfig: SnowpackConfig, pluginOptions: PluginOptions = {}): SnowpackPlugin {
	let {
		extensions = ['.svelte'],
		numWorkers,
		typescript,
		preprocess: preprocessGroup,
		compilerOptions,
		hmrOptions,
	} = pluginOptions;

	let sourcemap = snowpackConfig.buildOptions.sourceMaps;

	let pool = new WorkerPool<PluginWorker>(workerScript, { max: numWorkers });

	return {
		name: 'snowpack-plugin-svelte-ts',

		resolve: {
			input: extensions,
			output: ['.js', '.css'],
		},
		knownEntrypoints: [
			'svelte/internal',
			'svelte-hmr/runtime/hot-api-esm.js',
			'svelte-hmr/runtime/proxy-adapter-dom.js',
		],

		async load ({ filePath, isDev, isHmrEnabled, isSSR }) {
			let source = await fs.readFile(filePath, 'utf-8');

			if (preprocessGroup) {
				source = (
					await preprocess(source, preprocessGroup, { filename: filePath })
				).code;
			}

			return pool.exec('compile', [{
				filePath,
				source,
				compilerOptions,
				hmrOptions,
				typescript,
				sourcemap,
				isDev,
				isHmrEnabled,
				isSSR,
			}])
				.catch((err) => {
					console.log('error');
					console.log(err);
					return Promise.reject(err);
				});
		},

		async cleanup () {
			await pool.close();
		},
	}
}

export default plugin;
