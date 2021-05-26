// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./claimer.sol";

contract SubFactory is Claimer {
    event NewClaimer(Claimer child);
    constructor(address payable owner, address payable deployer) Claimer (owner, deployer) {
    }
    function claimer() public {
        require(msg.sender == _owner || msg.sender == _deployer, "Not owner");
        Claimer child = new Claimer(_owner, _deployer);
        emit NewClaimer(child);
    }
}
