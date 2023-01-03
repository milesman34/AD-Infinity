import { defineStore } from "pinia";

import { Dimension } from "../dimensions.js";

// Core store for the game
export const useGameStore = defineStore("game", {
    state: () => ({
        // Current amount of antimatter
        antimatter: new Decimal(10),

        // Number of dimboosts purchased
        dimBoosts: 0,

        // Number of galaxies purchased
        galaxies: this.dimBoosts * 5,

        // Current normal dimensions
        dimensions: [
            Dimension({
                tier: 1,
                cost: new Decimal(10),
                costMultiplier: new Decimal(1e2)
            }),

            Dimension({
                tier: 2,
                cost: new Decimal(100),
                costMultiplier: new Decimal(1e3)
            }),

            Dimension({
                tier: 3,
                cost: new Decimal(1e4),
                costMultiplier: new Decimal(1e4)
            }),

            Dimension({
                tier: 4,
                cost: new Decimal(1e6),
                costMultiplier: new Decimal(1e6)
            }),

            Dimension({
                tier: 5,
                cost: new Decimal(1e9),
                costMultiplier: new Decimal(1e9)
            }),

            Dimension({
                tier: 6,
                cost: new Decimal(1e12),
                costMultiplier: new Decimal(1e12)
            }),

            Dimension({
                tier: 7,
                cost: new Decimal(1e15),
                costMultiplier: new Decimal(1e16)
            }),

            Dimension({
                tier: 8,
                cost: new Decimal(1e18),
                costMultiplier: new Decimal(1e21)
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