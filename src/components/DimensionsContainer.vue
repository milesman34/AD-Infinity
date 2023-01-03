<script>
import { useGameStore } from "../store/store.js";

export default {
    setup() {
        let store = useGameStore();

        return {
            store
        };
    }
}
</script>

<template>
    <div id="dimensions-container">
        {{ store.dimensions[7].requiredDimboostsToUnlock() }}
    </div>
</template>

<style scoped>
    #dimensions-container {

    }
</style>