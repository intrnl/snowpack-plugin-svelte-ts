let code = 'import { a, b, FooBar } from "a"; let c: FooBar = a.expose()';

// let { transformSync } = require('@babel/core');
// let babelStart = Date.now();
// console.log(
//   transformSync(code, {
//     plugins: [
//       [require('@babel/plugin-transform-typescript'), {
//         onlyRemoveTypeImports: true,
//       }]
//     ]
//   })
// );
// let babelEnd = Date.now();

let { transpileModule, visitNode, visitEachChild, isImportDeclaration, ImportsNotUsedAsValues, ScriptTarget } = require('typescript');
let tsStart = Date.now();
console.log(
  transpileModule(code, {
    compilerOptions: {
      target: ScriptTarget.Latest,
      importsNotUsedAsValues: ImportsNotUsedAsValues.Error,
    },
    transformers: {
      before: [importTransformer],
    },
  })
);
/** @type {import('typescript').TransformerFactory<import('typescript').SourceFile>} */
function importTransformer (context) {
  let { createImportDeclaration, createEmptyStatement } = context.factory;

  /** @type {import('typescript').Visitor} */
  function visit (node) {
    if (isImportDeclaration(node)) {
      if (node.importClause?.isTypeOnly) {
        return createEmptyStatement();
      }

      return createImportDeclaration(
        node.decorators,
        node.modifiers,
        node.importClause,
        node.moduleSpecifier,
      );
    }

    return visitEachChild(node, (child) => visit(child), context);
  }

  return (node) => visitNode(node, visit);
}
let tsEnd = Date.now();

// console.log('Babel took', babelEnd - babelStart);
console.log('TypeScript took', tsEnd - tsStart);

// let { transformSync } = require('esbuild');
// console.log(
//   transformSync(code, {
//     loader: 'ts',
//     tsconfigRaw: {
//       compilerOptions: {
//         importsNotUsedAsValues: 'preserve',
//       },
//     },
//   })
// );
