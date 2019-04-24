/*
SPDX-License-Identifier: Apache-2.0
 */

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access ShipAny network
 * 4. Construct request to add shipany order
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const baseDir = __dirname + "/";
const fs = require('fs');
const yaml = require('js-yaml');
const {FileSystemWallet, Gateway} = require('fabric-network');
const ShipanyOrder = require(baseDir + '../contract/lib/order.js');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet(baseDir + '../identity/user/isabella/wallet');

async function addOrder(contract, orderJsonStr) {
    // Add shipany order
    console.log('Submit shipany order ADD transaction.');
    const addOpResp = await contract.submitTransaction('addOrder', orderJsonStr);

    if ("" === addOpResp.toString()) {
        console.log("[main::output] No order contract is added successfully.");
        return;
    }

    const decoded_resp = addOpResp.toString();
    // Call JSON.parse(...) to remove escape of quotes("") in the string. e.g. {\"uid\":\"547ae619-4b39-45ac-b13d-2900e6ab04f1\"}
    const result = JSON.parse(decoded_resp);
    console.log("[main::output] " + result);
}

async function getOrder(contract, key) {
    // Get shipany order
    console.log('Submit shipany order GET transaction.');
    const getOpResp = await contract.submitTransaction('getOrder', key);

    if ("" === getOpResp.toString()) {
        console.log("[main::output] No order contract is found.");
        return;
    }

    const decoded_resp = getOpResp.toString();
    // Call JSON.parse(...) to remove escape of quotes("") in the string. e.g. {\"uid\":\"547ae619-4b39-45ac-b13d-2900e6ab04f1\"}
    const result = JSON.parse(decoded_resp);
    console.log("[main::output] " + result);
}

async function updateOrder(contract, key, orderJsonStr) {
    // Update shipany order
    console.log('Submit shipany order UPDATE transaction.');
    const updateUpResp = await contract.submitTransaction(
        'updateOrder', key, orderJsonStr)
}

async function deleteOrder(contract, key) {
    // // Delete shipany order
    console.log('Submit shipany order DELETE transaction.');
    const deleteUpResp = await contract.submitTransaction('deleteOrder', key);

    console.log();
    console.log("typeof deleteUpResp:", typeof deleteUpResp); // !!!
    console.log(deleteUpResp); // !!!
    console.log(deleteUpResp.toString()); // !!!
    console.log();
}

async function listOrders(contract) {
    // List shipany orders
    console.log('Submit shipany order LIST transaction.');
    const listOpResp = await contract.submitTransaction('listOrders');
    const result = listOpResp.toString();
    console.log("[main::output] " + result);
}

async function getHistory(contract, key) {
    // Get the history of an order
    const getHistoryOp = await contract.submitTransaction('getOrderHistroy', key);
    const result = getHistoryOp.toString();
    console.log("[main::output] " + result);
}

// Main program function
async function main() {
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        // Specify userName for network access
        const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync(baseDir + '../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {
                enabled: false,
                asLocalhost: true
            }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access ShipAny network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to shipany order contract
        console.log('Use org.ShipAny.shipanyorder smart contract.');

        const contract = await network.getContract('ordercontract', 'org.shipany.shipanyorder');

        if (process.argv.length < 3) {
            console.log("Expect at least 1 argument .");
            return;
        }

        if ("add" === process.argv[2]) {
            if (process.argv.length < 4 || "" === process.argv[3]) {
                console.log("[main::output] Please provide valid ShipAny order JSON.");
                return;
            }

            await addOrder(contract, process.argv[3]);
        } else if ("get" === process.argv[2]) {
            await getOrder(contract, process.argv[3]);
        } else if ("update" === process.argv[2]) {
            await updateOrder(contract, process.argv[3], process.argv[4]);
        } else if ("delete" === process.argv[2]) {
            await deleteOrder(contract, process.argv[3]);
        } else if ("list" === process.argv[2]) {
            await listOrders(contract);
        } else if ("getHistory" === process.argv[2]) {
            await getHistory(contract, process.argv[3])
        } else {
            console.log("[main::output] Invalid operation found.");
        }
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.')
        gateway.disconnect();
    }
}

main().then(() => {
    console.log('Issue program complete.');
}).catch((e) => {
    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
