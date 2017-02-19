pragma solidity ^0.4.2;

import './zeppelin/token/CrowdsaleToken.sol';

contract WingsCrowdsale is CrowdsaleToken {
  string public name = "";
  string public symbol = "";

  uint goal;

  function WingsCrowdsale(string _name, string _symbol) {
    name = _name;
    symbol = _symbol;
  }

  function getTotal() constant returns (uint) {
    return totalSupply;
  }

}
