<script>
import { useGameStore } from "../store/store.js";
import { getAffordClass } from "../helpers";
import { scientific } from "../format.js";

export default {
    props: ["tier"],

    setup() {
        let store = useGameStore();

        return {
            scientific,
            store
        };
    },

    methods: {
        getAffordClass
    },

    computed: {
        // Gets the text to display for the dimension amount
        dimensionAmountText() {
            const amount = this.store.getDimensionAmount(this.tier);
            const purchases = this.store.getDimensionPurchasesOnCurrent10(this.tier);

            return scientific.format(amount, 2) + (purchases === 0 ? "" :
                ` (${purchases})`);
        }
    }
}
</script>

<template>
    <div class="dimension-container">
        <div class="dimension-name-container">
            <div class="dimension-name-display flex-center">{{ store.getTierString(tier) }} Dimension</div>
            <div class="dimension-multiplier-display flex-center">x{{ scientific.format(store.getDimensionMultiplier(tier), 2, 1) }}
            </div>
        </div>

        <div class="dimension-amount-container">
            {{ dimensionAmountText }}
        </div>

        <div class="buy-buttons-container">
            <button @click="store.buyDimension(tier)" :class="getAffordClass(store.canAffordDimension(tier))"
                class="dim-button buy-dimension-button">{{ scientific.format(store.getDimensionCost(tier)) }}
                AM</button>
            <button @click="store.buyDimensionUntil10(tier)"
                :class="getAffordClass(store.canAffordDimensionUntil10(tier))"
                class="dim-button buy-until10-button">Until 10, {{
        scientific.format(store.getDimensionCostUntil10(tier))
                }} AM</button>
        </div>
    </div>
</template>

<style scoped>
.dimension-container {
    display: grid;
    grid-template-columns: 20% 20% 30% auto 30%;
    margin-top: 1vh;
    margin-bottom: 1vh;
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

.dimension-amount-container {
    grid-column: 3;
}

.buy-buttons-container {
    display: grid;
    grid-template-columns: 60% 40%;
    grid-column: 5;
}

.dim-button {
    height: 100%;
    font-size: 0.8rem;
}

.buy-dimension-button {
    margin-right: 1vw;
}
</style>