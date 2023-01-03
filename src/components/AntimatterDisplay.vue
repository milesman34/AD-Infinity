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
    <div class="flex-column">
        <div id="antimatter-display">
            You have <span id="number-display">{{ formatValue(store.antimatter, 2, true) }}</span> antimatter
        </div>

        <div id="antimatter-per-second-display">
            You are getting <span id="aps-display">{{ formatValue(store.antimatterProduction) }}</span> antimatter per
            second
        </div>
    </div>
</template>

<style scoped>
#antimatter-display {
    font-size: 1rem;
    margin-bottom: 5px;
}

#number-display {
    font-size: 3rem;
    color: rgb(0, 255, 255);
}

#antimatter-per-second-display {
    font-size: 0.7rem;
}

#aps-display {
    color: rgb(0, 255, 255);
    font-size: 1rem;
}
</style>