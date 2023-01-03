<script>
import { useGameStore } from "../store/store.js";
import { formatValue } from "../format.js";

export default {
    props: ["tier"],

    methods: {
        formatValue,

        // Gets the class to use for the button (affordable/unaffordable) based on if it can afford it
        getAffordClass(affordable) {
            return {
                "button-affordable": affordable,
                "button-unaffordable": !affordable
            };
        }
    },

    setup() {
        let store = useGameStore();

        return {
            store
        };
    }
}
</script>

<template>
    <div class="dimension-container">
        <div class="dimension-name-container">
            <div class="dimension-name-display flex-center">{{ store.getTierString(tier) }} Dimension</div>
            <div class="dimension-multiplier-display flex-center">x{{ formatValue(store.getDimensionMultiplier(tier)) }}
            </div>
        </div>

        <div class="dimension-amount-container flex-center">
            {{ formatValue(store.getDimensionAmount(tier), 2, true) }}
        </div>

        <div class="buy-buttons-container">
            <button @click="store.buyDimension(tier)" :class="getAffordClass(store.canAffordDimension(tier))"
                class="dim-button buy-dimension-button">Cost: {{ formatValue(store.getDimensionCost(tier)) }}</button>
            <button @click="store.buyDimensionUntilTen(tier)"
                :class="getAffordClass(store.canAffordDimensionUntilTen(tier))"
                class="dim-button buy-until10-button">Until 10, Cost: {{
        formatValue(store.getDimensionCostUntilTen(tier))
                }}</button>
        </div>
    </div>
</template>

<style scoped>
.dimension-container {
    display: grid;
    grid-template-columns: 20% 50% auto 20%;
    margin-top: 1vh;
    margin-bottom: 1vh;
    margin-left: 1vw;
    margin-right: 1vw;
    height: 3vh;
}

.dimension-name-container {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.dimension-name-display {
    font-size: 1.2rem;
    margin-right: 1rem;
}

.dimension-multiplier-display {
    font-size: 1.2rem;
    color: rgb(0, 255, 255);
}

.buy-buttons-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-column: 4;
}

.dim-button {
    height: 100%;
}

.button-affordable {
    background-color: rgb(108, 107, 116);
    border: 2px solid green;
}

.button-affordable:hover {
    background-color: white;
}

.button-unaffordable {
    background-color: rgb(72, 71, 77);
    border: 2px solid red;
}

.buy-dimension-button {
    margin-right: 1vw;
    width: 5vw;
}

.buy-until10-button {
    width: 10vw;
}
</style>