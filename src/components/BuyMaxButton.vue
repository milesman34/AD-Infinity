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
    <div class="flex-center">
        <button id="buy-max-button" class="button-affordable" @click="store.buyMax()">
            Buy Max
        </button>
    </div>
</template>

<style scoped>
#buy-max-button {
    width: 10vw;
    height: 3vh;
    margin-left: 1vw;
}
</style>