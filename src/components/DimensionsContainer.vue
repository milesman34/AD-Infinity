<script>
import { useGameStore } from "../store/store.js";
import DimboostContainer from "./DimboostContainer.vue";
import DimensionContainer from "./DimensionContainer.vue";

export default {
    components: {
        DimboostContainer,
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
        
        <DimboostContainer />
    </div>
</template>

<style scoped>
#dimensions-container {
    display: flex;
    flex-direction: column;
    grid-row: 3;
    margin-top: 5vh;
    margin-left: 1vw;
    margin-right: 1vw;
}
</style>