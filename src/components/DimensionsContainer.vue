<script>
import { useGameStore } from "../store/store.js";
import DimensionContainer from "./DimensionContainer.vue";

export default {
    components: {
        DimensionContainer
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
    <div id="dimensions-container">
        <DimensionContainer :tier="dimension.tier" :key="dimension.tier" v-for="dimension in store.unlockedDimensions" />
    </div>
</template>

<style scoped>
#dimensions-container {
    display: flex;
    flex-direction: column;
    grid-row: 3;
    margin-top: 5vh;
}
</style>