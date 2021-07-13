const fs = require('fs');
const chalk = require('chalk');

const artifactsDir = './packages/hardhat-old/artifacts';
const sourcesDir = './packages/hardhat-old/contracts';

const reactAppDir = './packages/react-app/src/contracts';
const botsDir = './packages/bots/contracts';

function getAddress(contractName) {
  try {
    return fs.readFileSync(`${artifactsDir}/${contractName}.address`).toString();
  } catch (e) {
    return null;
  }
}

function publishContract(contractName, dir) {
  const address = getAddress(contractName);
  if (!address) {
    console.log(chalk.red('Not found'), chalk.cyan(contractName));
    return false;
  }

  console.log(
    'Publishing',
    chalk.cyan(contractName),
    'to',
    chalk.yellow('"react-app" and "bots" workspaces'),
  );
  try {
    let contract;
    if (dir) {
      contract = fs.readFileSync(
        `${artifactsDir}/contracts/${dir}/${contractName}.sol/${contractName}.json`,
      );
    } else {
      contract = fs.readFileSync(
        `${artifactsDir}/contracts/${contractName}.sol/${contractName}.json`,
      );
    }
    contract = JSON.parse(contract.toString());

    fs.writeFileSync(`${reactAppDir}/${contractName}.address.js`, `module.exports = "${address}";`);
    fs.writeFileSync(
      `${reactAppDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`,
    );
    fs.writeFileSync(
      `${reactAppDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`,
    );

    fs.writeFileSync(`${botsDir}/${contractName}.address.js`, `module.exports = "${address}";`);
    fs.writeFileSync(
      `${botsDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`,
    );
    fs.writeFileSync(
      `${botsDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`,
    );

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function findMoreSolFiles(path) {
  const list = [];
  fs.readdirSync(path).forEach(file => {
    if (file.indexOf('.sol') >= 0) {
      const contractName = file.replace('.sol', '');
      list.push(contractName);
    }
  });

  return list;
}

async function main() {
  if (!fs.existsSync(reactAppDir)) {
    fs.mkdirSync(reactAppDir);
  }

  const finalContractList = [];
  fs.readdirSync(sourcesDir).forEach(file => {
    if (file.indexOf('.sol') >= 0) {
      const contractName = file.replace('.sol', '');
      if (publishContract(contractName)) {
        finalContractList.push(contractName);
      }
    }
    // if it's a directory
    else if (file.indexOf('.') === -1) {
      findMoreSolFiles(`${sourcesDir}/${file}`).forEach(contractName => {
        if (publishContract(contractName, file)) {
          finalContractList.push(contractName);
        }
      });
    }
  });
  console.log(finalContractList);
  fs.writeFileSync(
    `${reactAppDir}/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`,
  );
  fs.writeFileSync(
    `${botsDir}/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`,
  );
  fs.writeFileSync(
    `./tasks/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`,
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
