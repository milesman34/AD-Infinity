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
    }
}
</script>

<template>
    <div id="galaxy-container">
        <div id="galaxy-text-container">
            Antimatter Galaxies ({{ store.galaxies }}): requires {{ store.galaxyCost }} 8th Dimensions
        </div>

        <button id="galaxy-button" :class="getAffordClass(store.canAffordGalaxy)" @click="store.buyGalaxy" >
            Reset your Dimensions and Dimension Boosts for a boost to Tickspeed upgrades
        </button>
    </div>
</template>

<style scoped>
#galaxy-container {
    margin-top: 1vh;
    font-size: 1.2rem;

    display: grid;

    grid-template-columns: 40% auto 30%;
    height: 5vh;
}

#galaxy-text-container {
    display: flex;

    flex-direction: row;
    align-items: center;
}

#galaxy-button {
    grid-column: 3;
    width: 50%;
    font-size: 0.75rem;
}
</style>