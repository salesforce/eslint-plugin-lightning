/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-moment');

const ruleTester = new RuleTester(ESLINT_TEST_CONFIG);

ruleTester.run('no-moment', rule, {
    valid: [
        {
            code: `import { getDateTimeFormat, getNumberFormat } from '@salesforce/i18n-service';`,
        },
        {
            code: `import localizer from '@salesforce/i18n-service';`,
        },
        {
            code: `var localizer = require('i18n-service');`,
        },
        {
            code: `var moment = require('not-moment');`,
        },
        {
            code: `import moment from 'not-moment'`,
        },
    ],
    invalid: [
        {
            code: `var moment = require('moment');`,
            errors: [
                {
                    message: "Using 'moment' library is not allowed.",
                },
            ],
        },
        {
            code: `var m = require('moment');`,
            errors: [
                {
                    message: "Using 'moment' library is not allowed.",
                },
            ],
        },
        {
            code: `import moment from 'moment';`,
            errors: [
                {
                    message: "Using 'moment' library is not allowed.",
                },
            ],
        },
        {
            code: `import * as m from 'moment';`,
            errors: [
                {
                    message: "Using 'moment' library is not allowed.",
                },
            ],
        },
    ],
});
