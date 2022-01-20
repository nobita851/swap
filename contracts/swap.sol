pragma solidity ^0.8.5;

import "./wrappedBNB.sol";

contract swap{

    address payable public owner;
    wrappedBNB public wBNB;

    constructor(wrappedBNB _wBNB){
        wBNB = _wBNB;
        owner = payable(msg.sender);
    }


    function swapTokens() public payable{
        require(msg.value>0, "Insufficient Value");
        uint amount = msg.value;
        require(wBNB.balanceOf(address(this)) > amount,"Insufficient funds in contract");
        wBNB.transfer(msg.sender, amount);
        owner.transfer(amount);
    }
}