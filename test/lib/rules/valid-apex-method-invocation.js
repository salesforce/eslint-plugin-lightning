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
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts();
    //   `,
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts({});
    //   `,
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts({ searchKey: 'Ted' });
    //   `,
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     const args = { searchKey: 'Ted' };
    //     findContacts(args);
    //   `,
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';

    //     function callApex(args) {
    //       findContacts(args);
    //     }
    //   `,
    // },
    // {
    //   //
    //   code: `
    //     import { namedApexImport } from '@salesforce/apex/ContactController.findContacts';
    //     namedApexImport('Ted');
    //   `,
    // },
    {
      code: `
        import salesforceImport from '@salesforce/something';
        salesforceImport('Ted')
      `,
    },
  ],
  invalid: [
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts('Ted');
    //   `,
    //   errors: [
    //     {
    //       message: 'Invalid apex method invocation. Apex methods expect an object as argument.',
    //     },
    //   ],
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts(true);
    //   `,
    //   errors: [
    //     {
    //       message: 'Invalid apex method invocation. Apex methods expect an object as argument.',
    //     },
    //   ],
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts(42);
    //   `,
    //   errors: [
    //     {
    //       message: 'Invalid apex method invocation. Apex methods expect an object as argument.',
    //     },
    //   ],
    // },
    {
      code: `
        import findContacts from '@salesforce/apex/ContactController.findContacts';
        const args = 'Ted';
        findContacts(args);
      `,
      errors: [
        {
          message: 'TODO',
        },
      ],
    },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';
    //     findContacts('Ted', 'Salesforce');
    //   `,
    //   errors: [
    //     {
    //       message: 'Invalid apex method invocation. Apex methods only accept a single argument.',
    //     },
    //   ],
    // },
    // {
    //   code: `
    //     import findContacts from '@salesforce/apex/ContactController.findContacts';

    //     function callApex(arg1, arg2) {
    //       findContacts(arg1, arg2);
    //     }
    //   `,
    //   errors: [
    //     {
    //       message: 'Invalid apex method invocation. Apex methods only accept a single argument.',
    //     },
    //   ],
    // },
  ],
});
