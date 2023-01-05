<script>
import { useGameStore } from "../store/store.js";
import { getAffordClass } from "../helpers";

export default {
    setup() {
        let store = useGameStore();

        return {
            store
        };
    },

    methods: {
        getAffordClass
    },

    computed: {
        // Returns the cost for the dimboost cost text
        dimboostCostText() {
            const cost = this.store.dimboostCost;

            return `${cost.amount} ${this.store.getTierString(cost.tier)}`;
        }
    }
}
</script>

<template>
    <div id="dimboost-container">
        <div id="dimboost-text-container">
            Dimension Boost ({{ store.dimboosts }}): requires {{ dimboostCostText }} Dimensions
        </div>

        <button id="dimboost-button" :class="getAffordClass(store.canAffordDimboost)" @click="store.buyDimboost" >
            Reset the game for a boost
        </button>
    </div>
</template>

<style scoped>
#dimboost-container {
    margin-top: 1vh;
    font-size: 1.2rem;

    display: grid;

    grid-template-columns: 40% auto 30%;
    height: 5vh;
}

#dimboost-button {
    grid-column: 3;
    width: 50%;
}
</style>