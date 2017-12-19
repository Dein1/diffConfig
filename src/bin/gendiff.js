#! /usr/bin/env node

import program from 'commander';
import diff from '..';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .action((config1, config2) => console.log(diff(config1, config2)))
  .parse(process.argv);
