let {
	transpileModule,

	visitNode,
	visitEachChild,
	isImportDeclaration,

	ImportsNotUsedAsValues,
	ScriptTarget,
} = require('typescript');

module.exports = {
	/** @type {import('svelte/types/compiler/preprocess').PreprocessorGroup} */
	preprocessTS: {
		script ({ content, attributes, filename }) {
			let { lang } = attributes;

			if (lang != 'ts' && lang != 'typescript') return { code: content };

			let { outputText } = transpileModule(content, {
				fileName: filename,
				compilerOptions: {
					target: ScriptTarget.Latest,
					importsNotUsedAsValues: ImportsNotUsedAsValues.Preserve,
				},
				transformers: {
					before: [importTransformer],
				},
			});

			return { code: outputText };
		},
	},
};

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
