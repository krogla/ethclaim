// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./owner.sol";

contract Claimer is Owner {
    constructor(address payable owner, address payable deployer)
        Owner(owner, deployer)
    {}

    function claim(address payable recipient) public {
        require(msg.sender == _owner || msg.sender == _deployer, "Not owner");

        (bool sent, ) = recipient.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function die() public payable {
        require(msg.sender == _owner || msg.sender == _deployer, "Not owner");
        selfdestruct(_owner);
    }
}
