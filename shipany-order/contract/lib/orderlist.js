/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const ShipanyOrder = require('./order.js');

class OrderList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.shipany.orderlist');
    }

    async addOrder(order) {
        return this.addState(order);
    }

    async getOrder(key) {
        return this.getState(key);
    }

    async updateOrder(key, order) {
        return this.updateState(key, order);
    }

    async deleteOrder(key) {
        return this.deleteState(key);
    }

    async listOrders() {
        return this.listStates();
    }
}

module.exports = OrderList;
