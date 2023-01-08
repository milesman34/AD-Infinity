<script>
import { getAffordClass } from "../helpers";
import { useGameStore } from "../store/store.js";
import { scientific } from "../format";

export default {
    setup() {
        let store = useGameStore();

        return {
            getAffordClass,
            scientific,
            store
        };
    }
}
</script>

<template>
    <div class="flex-center">
        <button id="sacrifice-button" :class="getAffordClass(store.canPlayerSacrifice)" @click="store.dimensionalSacrifice()" v-show="store.sacrificeUnlocked">
            Dimensional Sacrifice ({{ scientific.format(store.currentBoostOnSacrifice, 2, 1) }}x)
        </button>
    </div>
</template>

<style scoped>
#sacrifice-button {
    width: 15vw;
    height: 3vh;
}
</style>