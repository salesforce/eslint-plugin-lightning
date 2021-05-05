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
      description: 'enforce invoking Apex methods with the right arguments',
      url: docUrl('valid-apex-method-invocation'),
    },
    schema: [],
  },

  create(context) {
    function isApexMethodReference(ref) {
      const [def] = ref.defs;

      return (
        def &&
        def.type === 'ImportBinding' &&
        def.parent.source.value.match(/^@salesforce\/apex\/.*/) &&
        (def.node.type === 'ImportDefaultSpecifier' ||
          (def.node.type === 'ImportSpecifier' &&
            def.node.imported.name === 'default'))
      );
    }

    function validateApexInvocation(node, scope) {
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
        const argReference = scope.references.find((r) => r.identifier === arg)
          .resolved;

        // Ignore unresolved or undefined arguments
        if (!argReference || !argReference.defs.length) {
          return;
        }

        const [argDefinition] = argReference.defs;
        if (
          argDefinition.type === 'Variable' &&
          argDefinition.parent.kind === 'const' &&
          argDefinition.node.init &&
          argDefinition.node.init.type === 'Literal'
        ) {
          return context.report({
            node,
            message:
              'Invalid apex method invocation. Apex methods expect an object as argument.',
          });
        }
      }
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        if (callee.type !== 'Identifier') {
          return;
        }

        // Retrieve the callee reference from the current scope.
        const scope = context.getScope();
        const methodReference = scope.references.find(
          (r) => r.identifier === callee
        ).resolved;

        // Ignore the call expression if it can't be resolved from the current scope or if the
        // call expression doesn't reference an Apex method.
        if (!methodReference || !isApexMethodReference(methodReference)) {
          return;
        }

        validateApexInvocation(node, scope);
      },
    };
  },
};
