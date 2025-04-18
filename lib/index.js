/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { version } = require('../package.json');

const rules = {
    'no-aura-localization-service': require('./rules/no-aura-localization-service'),
    'no-moment': require('./rules/no-moment'),
    'prefer-i18n-service': require('./rules/prefer-i18n-service'),
    'valid-apex-method-invocation': require('./rules/valid-apex-method-invocation'),
};

module.exports = {
    // https://eslint.org/docs/latest/extend/plugins#meta-data-in-plugins
    meta: {
        name: '@salesforce/eslint-plugin-lightning',
        version,
    },
    rules,
};
