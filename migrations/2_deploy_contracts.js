const WBNB = artifacts.require("wrappedBNB");
const Swap = artifacts.require("swap");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WBNB);
  const wBNB = await WBNB.deployed();

  await deployer.deploy(Swap, wBNB.address);
  const swap = await Swap.deployed();

  await wBNB.transfer(swap.address, "1000000000000000000000000");
};
