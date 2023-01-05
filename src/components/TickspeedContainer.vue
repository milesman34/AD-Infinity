<script>
import { useGameStore } from "../store/store.js";
import { getAffordClass } from "../helpers";
import { scientific } from "../format.js";
import Decimal from "break_infinity.js";

export default {
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
        // Formats the tickspeed upgrade power
        tickspeedPowerText() {
            const power = this.store.tickspeedUpgradePower;
            
            // multiply power by 100 to get the percentage
            return `${power.times(100)}%`;
        },

        // Formats the current tickspeed text
        tickspeedText() {
            const tickspeed = this.store.currentTickspeed;

            // Edge case for 1000 tickspeed
            if (tickspeed.equals(1000)) {
                return "1000";
            } else if (tickspeed.gte(100)) {
                return scientific.format(tickspeed);
            } else {
                return `${Math.round(tickspeed.mantissa * 100)} / ${scientific.format(new Decimal(10).pow(2 - tickspeed.exponent))}`
            }
        }
    }
}
</script>

<template>
    <div id="tickspeed-container" class="flex-column" v-show="store.tickspeedUnlocked">
        <div id="tickspeed-above-text">
            Reduce the tick interval by {{ tickspeedPowerText }}
        </div>
        
        <button @click="store.buyTickspeed()" :class="getAffordClass(store.canAffordTickspeed)" class="tickspeed-button">
            Tickspeed Cost: {{ scientific.format(store.tickspeedCost) }}
        </button>

        <div id="tickspeed-text">
            Tickspeed: {{ tickspeedText }}
        </div>
    </div>
</template>

<style scoped>
#tickspeed-container {
    margin-top: 2vh;
}

.tickspeed-button {
    margin-top: 10px;
    width: 10vw;
}

#tickspeed-text {
    margin-top: 10px;
}
</style>