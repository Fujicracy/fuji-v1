import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { refinanceVaults, liquidatePositions, saveBorrowers, saveRepayers } from './tasks/index.js';

const configs = JSON.parse(fs.readFileSync('./config.json'));

yargs(hideBin(process.argv))
  .usage('Usage: $0 COMMAND --network [networkName] --deployment [deployment]')
  .default({ network: 'ethereum', deployment: 'core' })
  .command({
    command: 'refinance',
    desc: '-> run refinance operation on vaults',
    handler: argv => refinanceVaults(configs[argv.network], argv.deployment),
  })
  .command({
    command: 'liquidate',
    desc: '-> liquidate undercollaterized positions',
    handler: argv => liquidatePositions(configs[argv.network], argv.deployment),
  })
  .command({
    command: 'borrowers',
    desc: '-> save borrowers in a csv file',
    handler: argv => saveBorrowers(configs[argv.network], argv.deployment),
  })
  .command({
    command: 'repayers',
    desc: '-> save repayers in a csv file',
    handler: argv => saveRepayers(configs[argv.network], argv.deployment),
  })
  .demandCommand()
  .help().argv;
