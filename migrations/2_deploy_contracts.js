/* global Token, Wings, WingsCrowdsale */

module.exports = (deployer) => {
  deployer.deploy(Token)
  deployer.deploy(Wings)
  deployer.deploy(WingsCrowdsale)
  // deployer.deploy(Token)
  // deployer.autolink()
}
