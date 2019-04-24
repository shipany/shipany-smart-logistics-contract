/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// ShipAny specifc classes
const ShipanyOrder = require('./order.js');
const OrderList = require('./orderlist.js');

/**
 * A custom context provides easy access to list of all shipany orders
 */
class ShipanyOrderContext extends Context {

    constructor() {
        super();
        // All orders are held in a list
        this.orderList = new OrderList(this);
    }
}

/**
 * Define shipany order smart contract by extending Fabric Contract class
 *
 */
class ShipanyOrderContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.shipany.shipanyorder');
    }

    /**
     * Define a custom context for shipany order
     */
    createContext() {
        return new ShipanyOrderContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Add Shipany Order
     *
     * @param {Context} ctx the transaction context
     * @param {String} orderJsonStr JSON string of an order
     */
    async addOrder(ctx, orderJsonStr) {
        let order = {};
        let orderJson = {};
        let shouldAbort = false;

        try {
            orderJson = JSON.parse(orderJsonStr);
        } catch (err) {
            console.log("Failed to parse input order JSON string. Reason:" );
            console.log(err);
            shouldAbort = true;
        }

        if (shouldAbort || {} === orderJson) {
            console.log("Failed to parse string to JSON. Abort immediately.");
            console.log("Input JSON string:");
            console.log(orderJsonStr);
            return JSON.stringify(order);
        }

        // create an instance of order
        order = ShipanyOrder.createInstance(orderJson);

        // console.log(); // !!!
        // console.log("order:", typeof order); // !!!
        // console.log(order); // !!!
        // console.log(); // !!!

        if (null === order) {
            return null;
        }

        // Add the order to the list of all similar shipany orders in the ledger world state
        await ctx.orderList.addOrder(order);
        // Must return a serialized order to caller of smart contract
        return JSON.stringify(order); // This result is implicitly converted to type of buffer
    }

    async getOrder(ctx, key) {
        let order = await ctx.orderList.getOrder(key);

        if (null === order) {
            return null;
        }

        return JSON.stringify(order);
    }

    async updateOrder(ctx, key, orderJsonStr) {
        let orderJson = {};

        try {
            orderJson = JSON.parse(orderJsonStr);
        } catch (err) {
            console.log("Failed to parse string to JSON. Abort immediately. "
                        + "orderJsonStr:");
            console.log(orderJsonStr);
            console.log("Error occurs:");
            console.log(err);
        }

        if ({} === orderJson) {
            console.log("Failed to parse string to JSON. Abort immediately.");
            return;
        }

        let res = await ctx.orderList.updateOrder(key, orderJson);

        console.log();
        console.log("[ShipanyOrderContract::updateOrder] res:");
        console.log(res);
        console.log();
    }

    async deleteOrder(ctx, key) {
        let res = await ctx.orderList.deleteOrder(key);

        console.log();
        // console.log("[ShipanyOrderContract::deleteOrder] res:");
        // console.log(res);
        console.log(res);
        console.log();

        return "deleted";
    }

    async listOrders(ctx) {
        let orders = await ctx.orderList.listOrders();
        return orders;
    }

    async getOrderHistroy(ctx, key) {
        const historyIter = await ctx.stub.getHistoryForKey(key);
        let allResults = [];

        while (true) {
            let res = await historyIter.next();

            // console.log(); // !!!
            // console.log("res:"); // !!!
            // console.log(res); // !!!
            // console.log(); // !!!

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                jsonRes.TxId = res.value.tx_id;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.IsDelete = res.value.is_delete.toString();

                try {
                    jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }

            if (res.done) {
                console.log('end of data');
                await historyIter.close();
                break;
            }

            // if (res.value && res.value.) {
            // }
        }

        // console.log(); // !!!
        // console.log("allResults:"); // !!!
        // console.log(allResults); // !!!
        // console.log(); // !!!

        return allResults;
    }
}

module.exports = ShipanyOrderContract;
