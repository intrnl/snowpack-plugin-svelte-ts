declare module 'svelte-hmr' {
	import type { compile, walk } from 'svelte/types/compiler';
	import type { CompileOptions } from 'svelte/types/compiler/interfaces';


	export interface HMROptions {
		noReload?: boolean,
		noPreserveState?: boolean,
		noPreserveStateKey?: string,
		optimistic?: boolean,

		acceptNamedExports?: boolean,
		acceptAccessors?: boolean,
		injectCss?: boolean,
		cssEjectDelay?: number,

		native?: boolean,
		compatVite?: boolean,
		importAdapter?: string,
		absoluteImports?: boolean,
	}

	export interface CreateMakeHotOptions {
		walk: typeof walk,
		meta?: string,
		hotApi?: string,
		adapter?: string,
	}

	export interface MakeHotOptions {
		id: string,
		compiledCode: string,
		hotOptions?: HMROptions,

		originalCode?: string,
		compiled?: ReturnType<typeof compile>,
		compileOptions?: CompileOptions,
	}

	export function createMakeHot (opts: CreateMakeHotOptions):
		(opts: MakeHotOptions) => string;
}
