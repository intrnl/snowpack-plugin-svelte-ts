import type { CompileOptions } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';
import type { HMROptions } from 'svelte-hmr';
import { SnowpackBuildMap, SnowpackBuiltFile } from 'snowpack';


export interface WorkerCompileOptions {
	filePath: string,
	source: string,
	compilerOptions?: CompileOptions,
	hmrOptions?: HMROptions,
	typescript?: boolean,
	sourcemap?: boolean,
	isDev?: boolean,
	isHmrEnabled?: boolean,
	isSSR?: boolean,
}

export interface WorkerCompileResult extends SnowpackBuildMap {
	'.js': SnowpackBuiltFile,
	'.css': SnowpackBuiltFile,
}

export interface PluginWorker {
	compile (opts: WorkerCompileOptions): WorkerCompileResult,
}

export interface PluginOptions {
	/** File extensions to process */
	extensions?: string[],
	/** How many workers to spawn in total */
	numWorkers?: number,
	/** Whether TypeScript preprocessing is enabled */
	typescript?: boolean,
	/** Svelte preprocessors */
	preprocess?: PreprocessorGroup | PreprocessorGroup[]
	/** Svelte compiler options */
	compilerOptions?: CompileOptions,
	/** Svelte HMR options */
	hmrOptions?: HMROptions,
}
