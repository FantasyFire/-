var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var CrowdSale = artifacts.require("./CrowdSale.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);

  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);

  deployer.link(ConvertLib, CrowdSale);
  deployer.deploy(CrowdSale);
};
