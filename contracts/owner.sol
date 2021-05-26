// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Owner {
    address payable _owner;
    address payable _deployer;

    constructor(address payable owner, address payable deployer) {
        require(owner != address(0x0) && deployer != address(0x0) , "Zerro address");
        _owner = owner;
        _deployer = deployer;
    }
}
