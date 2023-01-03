import { defineStore } from "pinia";

import { Dimension } from "../dimensions.js";

// Core store for the game
export const useGameStore = defineStore("game", {
    state: () => ({
        // Current amount of antimatter
        antimatter: new Decimal(10),

        // Current normal dimensions
        dimensions: [
            Dimension({
                type: 1,
                cost: new Decimal(10),
                costMultiplier: new Decimal(1e2)
            }),

            Dimension({
                type: 2,
                cost: new Decimal(100),
                costMultiplier: new Decimal(1e4)
            }),

            Dimension({
                type: 3,
                cost: new Decimal(1e4),
                costMultiplier: new Decimal(1e6)
            }),

            Dimension({
                type: 4,
                cost: new Decimal(1e6),
                costMultiplier: new Decimal(1e9)
            })
        ]
    }),

    actions: {
        // Adds more antimatter to the current amount
        addAntimatter(amount) {
            this.antimatter = this.antimatter.add(amount);
        }
    }
});