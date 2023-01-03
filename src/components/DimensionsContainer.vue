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
        5
    </div>
</template>

<style scoped>
    #dimensions-container {

    }
</style>