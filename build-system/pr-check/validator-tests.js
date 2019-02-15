/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * This script runs validator tests.
 * This is run during the CI stage = build; job = validator.
 */

const {
  printChangeSummary,
  startTimer,
  stopTimer,
  timedExecOrDie: timedExecOrDieBase} = require('./utils');
const {determineBuildTargets} = require('./build-targets');
const {isTravisPullRequestBuild} = require('../travis');

const FILENAME = 'validator-tests.js';
const timedExecOrDie =
  (cmd, unusedFileName) => timedExecOrDieBase(cmd, FILENAME);

function main() {
  const startTime = startTimer(FILENAME, FILENAME);
  const buildTargets = determineBuildTargets();
  printChangeSummary(FILENAME);

  if (!isTravisPullRequestBuild()) {
    timedExecOrDie('gulp validator');
    timedExecOrDie('gulp validator-webui');
  } else if (buildTargets.has('VALIDATOR')) {
    timedExecOrDie('gulp validator');
  } else if (buildTargets.has('VALIDATOR_WEBUI')) {
    timedExecOrDie('gulp validator-webui');
  } else {
    console.log('Skipping validator job because this commit does ' +
      'not affect the validator or validator web UI.');
  }

  stopTimer(FILENAME, FILENAME, startTime);
  return 0;
}

process.exit(main());