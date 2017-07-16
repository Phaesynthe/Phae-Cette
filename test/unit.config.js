/* global global, require */

const Cette = require('../src/cette');

// placing this in global space to avoid importing it in each test
global.Cette = Cette;

require('./unit/00_main.spec');
require('./unit/01_substitutions.spec');
