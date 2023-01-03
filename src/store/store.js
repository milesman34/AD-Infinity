import { defineStore } from "pinia";

// Core store for the game
export const useGameStore = defineStore("game", {
    state: () => ({
        // Current amount of antimatter
        antimatter: new Decimal(10)
    }),

    actions: {
        // Adds more antimatter to the current amount
        addAntimatter(amount) {
            this.antimatter = this.antimatter.add(amount);
        }
    }
});