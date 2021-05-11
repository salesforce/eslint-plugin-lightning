/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

module.exports = {
    root: true,
    extends: 'eslint:recommended',
    env: {
        es6: true,
        mocha: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 9,
    },
    rules: {
        strict: ['error', 'global'],
    },
};
