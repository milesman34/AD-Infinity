<script>
import { useGameStore } from "../store/store.js";
import { formatValue } from "../format.js";

export default {
    setup() {
        let store = useGameStore();

        return {
            store
        };
    },

    methods: {
        formatValue
    }
}
</script>

<template>
    <div class="flex-row">
        <div id="antimatter-display">  
            You have <span id="number-display">{{ formatValue(store.antimatter, 2, true) }}</span> antimatter
        </div>
    </div>
</template>

<style scoped>
    #antimatter-display {
        font-size: 1rem;
    }

    #number-display {
        font-size: 3rem;
        color: rgb(0, 255, 255);
    }
</style>