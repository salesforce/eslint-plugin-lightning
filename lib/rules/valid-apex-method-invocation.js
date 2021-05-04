/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { docUrl } = require('../utils/doc-url');

module.exports = {
  meta: {
    docs: {
      description: 'enforce invoking Apex methods with an object as argument',
      url: docUrl('valid-apex-method-invocation'),
    },
    schema: [],
  },

  create(context) {
    function isApexImportDeclaration(node) {
      return node.source.value.match(/^@salesforce\/apex\/.*/);
    }

    function validateApexInvocation(node) {
      // Invoking an Apex method with zero arguments is fine.
      if (node.arguments.length === 0) {
        return;
      }

      // Report error when invoking an Apex method with multiple arguments.
      if (node.arguments.length > 1) {
        return context.report({
          node,
          message:
            'Invalid apex method invocation. Apex methods only accept a single argument.',
        });
      }

      const [arg] = node.arguments;

      // Check first argument type passed to the method invocation.
      if (arg.type === 'Literal') {
        return context.report({
          node,
          message:
            'Invalid apex method invocation. Apex methods expect an object as argument.',
        });
      } else if (arg.type === 'Identifier') {
        const scope = context.getScope();
        console.log(scope);
      }
    }

    return {
      ImportDeclaration(node) {
        if (!isApexImportDeclaration(node)) {
          return;
        }

        const importDefaultSpecifier = node.specifiers.find(
          (specifier) => specifier.type === 'ImportDefaultSpecifier'
        );
        if (!importDefaultSpecifier) {
          return;
        }

        const methodIdentifier = importDefaultSpecifier.local;

        // Get all the Apex methods references in the file.
        const scope = context.getScope();
        const methodVariable = scope.set.get(methodIdentifier.name);

        for (const ref of methodVariable.references) {
          if (
            ref.identifier.parent &&
            ref.identifier.parent.type === 'CallExpression'
          ) {
            validateApexInvocation(ref.identifier.parent);
          }
        }
      },
    };
  },
};
