let { compile, preprocess, walk } = require('svelte/compiler');
let { createMakeHot } = require('svelte-hmr');

let { preprocessTS } = require('./typescript-preprocess');


let makeHot = (...args) => {
	makeHot = createMakeHot({ walk });
	return makeHot(...args);
};

/** @type {import('../lib/types/plugin').PluginWorker} */
module.exports = {
	async compile (opts) {
		let {
			filePath,
			source,
			compilerOptions = {},
			hmrOptions = {},
			typescript = true,
			useSourcemap = false,
			isDev = false,
			isHmrEnabled = false,
			isSSR = false,
		} = opts;

		let finalCompileOptions = {
			generate: isSSR ? 'ssr' : 'dom',
			css: false,
			...compilerOptions,
			dev: isDev,
			outputFilename: filePath,
			filename: filePath,
		};

		let finalHMROptions = {
			...hmrOptions,
			absoluteImports: false,
			injectCss: true,
		};

		if (typescript) {
			source = (
				await preprocess(source, preprocessTS, { filename: filePath })
			).code;
		}

		let compiled = compile(source, finalCompileOptions);
		let { js, css } = compiled;

		if (isHmrEnabled && !isSSR) {
			js.code = makeHot({
				id: filePath,
				compiledCode: js.code,
				hotOptions: finalHMROptions,

				originalCode: source,
				compiled,
				compileOptions: finalCompileOptions,
			});
		}


		let output = {
			'.js': { code: js.code, map: useSourcemap && js.map || null },
		};

		if (!finalCompileOptions.css && css && css.code) {
			output['.css'] = { code: css.code, map: useSourcemap && css.map || null };
		}

		return output;
	},
};
