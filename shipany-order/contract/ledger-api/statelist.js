/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key which associates it with the container, rather
 * than the container containing a link to the state. This minimizes collisions
 * for parallel transactions on different states.
 */
class StateList {

    /**
     * Store Fabric context for subsequent API access, and name of list
     */
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};
    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addState(state) {
        // let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let key = state.uid;
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        const data = await this.ctx.stub.getState(key);
        let state = {}

        if ("" === data.toString()) {
            return state;
        }

        state = State.deserialize(data);
        return state;
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(key, state) {
        // TODO: whether the existence of the key should be check first.
        let data = State.serialize(state);
        let res = await this.ctx.stub.putState(key, data);

        console.log(); // !!!
        console.log("[StateList::updateState] res: ", typeof res); // !!!
        console.log(res); // !!!
        console.log(); // !!!
    }

    async deleteState(key) {
        let res = await this.ctx.stub.deleteState(key);

        console.log(); // !!!
        console.log("[StateList::deleteState] res: ", typeof res); // !!!
        console.log(res); // !!!
        console.log(); // !!!
    }

    async listStates() {
        const statesIter = await this.ctx.stub.getStateByRange("", "");
        const orders = [];
        let counter = 1;

        while (true) {
            const res = await statesIter.next();

            // console.log();
            // console.log("[listStates] res:");
            // console.log(res);
            // console.log();

            if (res.value && res.value.value) {
                let resValStr = res.value.value.toString('utf8');
                let state;

                // console.log(); // !!!
                // // console.log("[StateList::addState] record type:", typeof record, "| record:");
                // console.log(resValStr); // !!!
                // console.log(); // !!!

                try {
                    state = JSON.parse(resValStr);
                } catch (err) {
                    console.log("Failed to parse state contents. State contents:");
                    console.log(resValStr);
                }

                if (state) {
                    orders.push(state);
                }
            }

            if (res.done || !res.value) {
                if (!res.value) {
                    console.log("No value found in state iterator:");
                    console.log(res);
                } else {
                    console.log("Listing orders completed. Total orders found: "
                                + counter.toString()); 
                }

                await statesIter.close();
                break
            }

            ++counter;
        }

        console.log();
        console.log(orders);
        console.log();

        return orders;
    }
}

module.exports = StateList;
