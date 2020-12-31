# snowpack-plugin-svelte-ts

> Deprecated. [ESBuild no longer removes unused imports][6]

Experimental Snowpack plugin for using Svelte components within your app

## What's different?

This adds TypeScript preprocessing to Svelte components in a worker pool,
which can't be done in a regular preprocessor plugin since it needs a lifecycle
hook to stop the workers when the build is finished.

What's next is to make sure you only use regular imports for normal exported
members and use [type-only imports][1] for types and interfaces.

It wouldn't be as fast as ESBuild, but until it provides an option to only
remove type imports since we don't actually know what bindings are used ahead
of time, this is the only best option we have right now. Note that the speed
improvements might not be drastic for smaller components so you might be better
off using [svelte-preprocess][2] instead.

> Technically, it *is* possible for us to try and see what bindings are used and
> then try to work around that, but that requires manually parsing the component
> and I don't think the overhead is worth it.

> Though, I'm sorry to say, I don't have any large projects to test this plugin
> with, though I'd imagine it would be the same as the [Babel plugin][5]?
> Not sure, have to test it properly.

## Usage

> It's not published to npm yet due to above, so you need to clone this
> repository and build it on your own.

```sh
npm install --save-dev @intrnl/snowpack-plugin-svelte-ts
# pnpm install --save-dev @intrnl/snowpack-plugin-svelte-ts
# yarn add --dev @intrnl/snowpack-plugin-svelte-ts
```

```js
// snowpack.config.js

export default {
  plugins: [
    ['@intrnl/snowpack-plugin-svelte-ts', {
      // See below for options
    }],
  ],
};
```

This plugin does not inherit configuration from `svelte.config.js`, you need to
import it manually.

## Options

- `extensions?: string[]`  
  File extensions to process, defaults to only processing `.svelte` files
- `maxWorkers?: number`  
  The maximum amount of workers to spawn, defaults to your CPU cores minus 1
- `typescript?: boolean`  
  Whether TypeScript preprocessing is enabled, defaults to `true`
- `preprocess?: PreprocessorGroup | PreprocessorGroup[]`  
  A preprocessor or an array of preprocessors, this runs before the builtin
  TypeScript preprocessor since it can't be done inside the worker.
- `compilerOptions?: CompileOptions`  
  Options for the Svelte compiler, [see here][3], some of the options might not
  be available however.
- `hmrOptions?: HMROptions`  
  Options for HMR behaviors in a component, [see here][4]


[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
[2]: https://npm.im/svelte-preprocess
[3]: https://svelte.dev/docs#svelte_compile
[4]: https://github.com/rixo/svelte-hmr#options
[5]: https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-babel
[6]: https://github.com/evanw/esbuild/issues/604#issuecomment-752882156
