/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/valid-apex-method-invocation');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('valid-apex-method-invocation', rule, {
    valid: [
        {
            // Invocation without arguments.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts();
            `,
        },
        {
            // Invocation without arguments (empty object).
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts({});
            `,
        },
        {
            // Invocation with arguments passed as a literal.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts({ searchKey: 'Ted' });
            `,
        },
        {
            // Invocation with arguments passed as a literal from a nested scope.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                class provider {
                    getData() {
                        findContacts({ searchKey: 'Ted' });
                    }
                }
            `,
        },
        {
            // Invocation on a continuation method with arguments passed as a literal.
            code: `
                import findContacts from '@salesforce/apexContinuation/ContactController.findContacts';
                findContacts({ searchKey: 'Ted' });
            `,
        },
        {
            // Invocation with an constant identifier referencing an object.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                const args = { searchKey: 'Ted' };
                findContacts(args);
            `,
        },
        {
            // Invocation with an argument retrieved from an expression.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(getArgs());
            `,
        },
        {
            // Invocation with an unresolved identifier.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(arg);
            `,
        },
        {
            // Invocation using a spread operator.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(...args);
            `,
        },
        {
            // Invocation with an let identifier reference. Even if the initial value is a literal, it
            // is impossible to assume the referenced value remains unchanged before invoking the
            // Apex method.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                let arg = 'Ted';
                findContacts(arg);
            `,
        },
        {
            // Invocation with an identifier referencing an argument.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                function callApex(args) {
                    findContacts(args);
                }
            `,
        },
        {
            // Invocation of a named import from an Apex module import. Apex modules only support default
            // import today. Invalid imports are ignored by this rule.
            code: `
                import { findContacts } from '@salesforce/apex/ContactController.findContacts';
                findContacts('Ted');
            `,
        },
        {
            // Invocation of a method coming from a non Apex module.
            code: `
                import findContacts from '@salesforce/something';
                findContacts('Ted');
            `,
        },
        {
            // Invocation of an unresolved function
            code: `
                findContacts('Ted');
            `,
        },
        {
            // [#4]: Fix regression related to the usage of Mixin
            code: `
                import { LightningElement } from 'lwc';
                import { NavigationMixin } from 'lightning/navigation';
                
                export default class extends NavigationMixin(LightningElement) {}
            `,
        },
    ],
    invalid: [
        {
            // Invocation with string literal.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts('Ted');
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with string literal in a nested scope.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                class provider {
                    getData() {
                        findContacts('Ted');
                    }
                }
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with boolean literal.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(true);
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with number literal.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(42);
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with array expression.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts([42]);
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation on a continuation method with arguments passed as a literal.
            code: `
                import findContacts from '@salesforce/apexContinuation/ContactController.findContacts';
                findContacts('Ted');
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with string literal using an identifier resolving to a const variable
            // initialized to string literal.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                const args = 'Ted';
                findContacts(args);
            `,
            errors: [
                {
                    messageId: 'invalidArgumentType',
                },
            ],
        },
        {
            // Invocation with 2 arguments.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                findContacts(arg1, arg2);
            `,
            errors: [
                {
                    messageId: 'invalidNumberOfArguments',
                },
            ],
        },
        {
            // Invocation with 2 arguments.
            code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                function callApex(arg1, arg2) {
                findContacts(arg1, arg2);
                }
            `,
            errors: [
                {
                    messageId: 'invalidNumberOfArguments',
                },
            ],
        },
    ],
});
