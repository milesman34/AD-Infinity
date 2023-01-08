<script>
import Decimal from "break_infinity.js";
import { useGameStore } from "../store/store.js";
import { scientific } from "../format";

// This shows how long it will be until the next save (auto-save)
export default {
    setup() {
        let store = useGameStore();

        return {
            Decimal,
            scientific,
            store
        };
    }
}
</script>

<template>
    <div id="save-bar" class="flex-center">
        <div>
            Saved {{ scientific.format(new Decimal(store.ticksSinceSave / 20), 2, 2) }} seconds ago
        </div>

        <button id="save-button" class="button-affordable" @click="store.saveUserData">
            Save
        </button>
    </div>
</template>

<style scoped>
#save-bar {
    width: 100%;
    height: 5vh;
    grid-row: 5;
}

#save-button {
    margin-left: 2.5vw;
    padding-left: 1vw;
    padding-right: 1vw;
}
</style>