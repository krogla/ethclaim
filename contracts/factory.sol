// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./claimer.sol";
import "./subfactory.sol";

contract Factory is Claimer {
    event NewClaimer(Claimer child);
    event NewSubFactory(SubFactory child);
    constructor(address payable owner, address payable deployer) Claimer (owner, deployer) {
    }

    function claimer() public {
        require(msg.sender == _owner || msg.sender == _deployer, "Not owner");
        Claimer child = new Claimer(_owner, _deployer);
        emit NewClaimer(child);
    }
    function subfactory() public {
        require(msg.sender == _owner || msg.sender == _deployer, "Not owner");
        SubFactory child = new SubFactory(_owner, _deployer);
        emit NewSubFactory(child);
    }
}
