// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Canvas {
    // Event emitted when a pixel is registered (when Ether is received)
    event PixelRegistered(
        uint256 amount,
        address sender,
        address contractAddress
    );

    // Event emitted when a destination address is funded
    event FundsTransferred(address contractAddress, uint256 amount);

    // Address to which funds can be withdrawn after 1 hour
    address public destination;
    // Timestamp of contract creation
    uint256 public creationTime;

    // Modifier to ensure the function runs only after 1 hour from creation
    modifier onlyAfterSixHours() {
        require(block.timestamp >= creationTime + 6 hours, "Funds can only be transferred 6 hours after contract creation");
        _;
    }

    modifier onlyDestination() {
        require(msg.sender == destination);
        _;
    }

    // Constructor to set the destination address and initialize creation time
    constructor(address _destination) {
        destination = _destination;
        creationTime = block.timestamp;
    }

    // Function to accept Ether and emit the PixelRegistered event
    receive() external payable {
        emit PixelRegistered(msg.value, msg.sender, address(this));
    }

    // Function to transfer all funds to the destination after 1 hour
    function transferFunds() external onlyAfterSixHours onlyDestination {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to transfer");
        payable(destination).transfer(balance);

        // Emit FundsTransferred event after successful transfer
        emit FundsTransferred(address(this), balance);
    }
}
