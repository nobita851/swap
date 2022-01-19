require("dotenv").config();
const { ethers } = require("ethers");

const WBNB = require("./build/contracts/wrappedBNB.json");
const Swap = require("./build/contracts/swap.json");

const bscProvider = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/a61a52180976b08f4ff81c83/bsc/testnet",
  { name: "bscTestnet", chainId: 97, confirmations: 10 }
);

const user = {
  address: process.env.userAddress,
  privateKey: process.env.userPrivateKey,
};

const deployer = {
  address: process.env.deployerAddress,
  privateKey: process.env.deployerPrivateKey,
};

const deployerWallet = new ethers.Wallet(deployer.privateKey, bscProvider);
const userWallet = new ethers.Wallet(user.privateKey, bscProvider);

const override = {
  gasLimit: 400000,
  gasPrice: ethers.utils.parseUnits("8.0", "gwei"),
  value: ethers.utils.parseUnits("0.2", "ether"),
};

const factory = new ethers.ContractFactory(
  WBNB.abi,
  WBNB.bytecode,
  deployerWallet
);

const factory2 = new ethers.ContractFactory(
  Swap.abi,
  Swap.bytecode,
  deployerWallet
);

async function run() {
  const contractWBNB = await factory.deploy();
  await contractWBNB.deployed();

  console.log(`Address wBNB = ${contractWBNB.address}`);

  const contractSwap = await factory2.deploy(contractWBNB.address);
  await contractSwap.deployed();

  console.log(`Address Swap = ${contractSwap.address}`);

  const userContract = new ethers.Contract(
    contractSwap.address,
    Swap.abi,
    userWallet
  );
  // const gas = await contractSwap.estimateGas.swapTokens(override);
  // console.log(`Gas = ${gas}`);
  let tx = await userContract.swapTokens(override);
  let txComplete = await tx.wait();
  console.log(
    `https://explorer.bitquery.io/bsc_testnet/tx/${txComplete.transactionHash}`
  );
}

run();
