// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/CanvasDeployer.sol"; // Adjust the path based on your project structure

contract DeployCanvasDeployer is Script {
    function run() external {
        // Fetch the deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions to the blockchain (local network)
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the CanvasDeployer contract (which deploys the initial Canvas)
        CanvasDeployer canvasDeployer = new CanvasDeployer();

        // Log the address of the deployed CanvasDeployer contract
        console.log("CanvasDeployer deployed at:", address(canvasDeployer));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
