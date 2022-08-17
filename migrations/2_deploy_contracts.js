const FOXToken = artifacts.require("FOXToken");
const NFTCollection = artifacts.require("NFTCollection");

module.exports = async function (deployer) {
  await deployer.deploy(NFTCollection);
  await deployer.deploy(FOXToken);
  const deployedNFT =  await NFTCollection.deployed();
  const deployedFOX = await FOXToken.deployed();
  const NFTAddress = deployedNFT.address;
  const FOXAddress = deployedFOX.address;
  console.log("NFTAddress", NFTAddress);
  console.log("FOXAddress", FOXAddress);
};