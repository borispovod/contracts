var Token = artifacts.require("../contracts/Token.sol");
var Wings = artifacts.require("../contracts/Wings.sol");
var WingsCrowdsale = artifacts.require("../contracts/WingsCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
  deployer.deploy(Wings);
  deployer.deploy(WingsCrowdsale);
};
