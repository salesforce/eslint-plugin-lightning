/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { version, repository } = require('../../package.json');

function docUrl(ruleName) {
    return `${repository.url}/blob/v${version}/docs/rules/${ruleName}.md`;
}

module.exports = {
    docUrl,
};
