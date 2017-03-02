pragma solidity ^0.4.2;

import './zeppelin/token/StandardToken.sol';

contract Token is StandardToken {
  string public name = "WINGS";
  string public symbol = "WNG";

  function Token() {
    var total = 100000000000000000000000000;
    totalSupply = total;
    balances[msg.sender] = total;
  }

}
