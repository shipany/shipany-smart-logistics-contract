/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * ShipanyOrder class extends State class
 * Class will be used by application and smart contract to define an order
 */
class ShipanyOrder extends State {

    constructor(obj) {
        // super(ShipanyOrder.getClass());
        super();
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        return ShipanyOrder.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to an shipany order
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserialize(data);
    }

    /**
     * Factory method to create a shipany order object
     */
    static createInstance(orderJson) {
        return new ShipanyOrder(orderJson);
    }

    static getClass() {
        return 'org.shipany.order';
    }
}

module.exports = ShipanyOrder;
