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
        galaxies: 0,

        // Current normal dimensions
        dimensions: [
            Dimension({
                tier: 1,
                cost: new Decimal(10),
                costMultiplier: new Decimal(1e3)
            }),

            Dimension({
                tier: 2,
                cost: new Decimal(100),
                costMultiplier: new Decimal(1e4)
            }),

            Dimension({
                tier: 3,
                cost: new Decimal(1e4),
                costMultiplier: new Decimal(1e5)
            }),

            Dimension({
                tier: 4,
                cost: new Decimal(1e6),
                costMultiplier: new Decimal(1e6)
            }),

            Dimension({
                tier: 5,
                cost: new Decimal(1e9),
                costMultiplier: new Decimal(1e8)
            }),

            Dimension({
                tier: 6,
                cost: new Decimal(1e13),
                costMultiplier: new Decimal(1e10)
            }),

            Dimension({
                tier: 7,
                cost: new Decimal(1e18),
                costMultiplier: new Decimal(1e12)
            }),

            Dimension({
                tier: 8,
                cost: new Decimal(1e24),
                costMultiplier: new Decimal(1e15)
            })
        ]
    }),

    getters: {
        // Gets the dimension with the given tier
        getDimension: state => tier => state.dimensions[tier - 1],

        // Gets the amount of a dimension
        getDimensionAmount: state => tier => state.getDimension(tier).amount,

        // Gets how many purchases the player has of a dimension
        getDimensionPurchases: state => tier => state.getDimension(tier).purchases,

        // Gets the number of 10x purchases the player has of a dimension
        getDimension10xPurchases: state => tier => Math.floor(state.getDimensionPurchases(tier) / 10),

        // Gets the current cost of a dimension
        getDimensionCost: state => tier => {
            const dimension = state.getDimension(tier);

            return dimension.startingCost.times(dimension.costMultiplier.pow(state.getDimension10xPurchases(tier)));
        },

        // Gets the cost of buying until 10 of a dimension
        getDimensionCostUntilTen: state => tier => {
            let purchased = state.getDimensionPurchases(tier) % 10;
            return state.getDimensionCost(tier).times(10 - purchased);
        },

        // Can the player afford buying a dimension
        canAffordDimension: state => tier => state.antimatter.gte(state.getDimensionCost(tier)),

        // Can the player afford buying a dimension until 10
        canAffordDimensionUntilTen: state => tier => state.antimatter.gte(state.getDimensionCostUntilTen(tier)),

        // Gets the number of dimboosts needed to unlock a dimension
        getRequiredDimboostsToUnlock: () => tier =>
            tier <= 4 ? 0 : tier - 4,

        // Gets the string for a tier
        getTierString: () => tier => {
            let ending = "";

            // 11-13 are always going to be "th"
            if ((tier % 100) >= 11 && (tier % 100) <= 13) {
                ending = "th";
            } else {
                let lastDigit = tier % 10;

                ending = lastDigit === 1 ? "st" : lastDigit === 2 ? "nd" : lastDigit === 3 ? "rd" : "th";
            }

            return `${tier}${ending}`;
        },

        // Gets if a dimension is unlocked
        isDimensionUnlocked: state => tier =>
            state.dimBoosts >= state.getRequiredDimboostsToUnlock(tier),

        // Gets the multiplier of a dimension
        getDimensionMultiplier: state => tier => {
            return new Decimal(2).pow(state.getDimension10xPurchases(tier));
        },

        // Gets the effective production from a dimension
        getDimensionProduction: state => tier =>
            state.getDimensionAmount(tier) * state.getDimensionMultiplier(tier),

        // Gets all unlocked dimensions
        unlockedDimensions: state => state.dimensions.filter(dim => state.isDimensionUnlocked(dim.tier))
    },

    actions: {
        // Adds more antimatter to the current amount
        addAntimatter(amount) {
            this.antimatter = this.antimatter.add(amount);
        },

        // Subtracts antimatter from the current amount
        subtractAntimatter(amount) {
            this.antimatter = this.antimatter.subtract(amount);
        },

        // Buys a dimension if it is affordable
        buyDimension(tier) {
            const cost = this.getDimensionCost(tier);
            const dimension = this.getDimension(tier);

            if (this.antimatter.gte(cost)) {
                this.subtractAntimatter(cost);

                // Add 1 purchase
                dimension.purchases++;

                // Add 1 to the amount
                this.addDimensionAmount(tier, 1);
            }
        },

        // Buys a dimension until 10 if it is affordable
        buyDimensionUntilTen(tier) {
            const cost = this.getDimensionCostUntilTen(tier);
            const dimension = this.getDimension(tier);

            if (this.antimatter.gte(cost)) {
                this.subtractAntimatter(cost);

                // Figure out how many purchases are needed
                const neededPurchases = 10 - (dimension.purchases % 10);

                // Add these purchases to the purchases + amounts
                dimension.purchases += neededPurchases;
                this.addDimensionAmount(tier, neededPurchases);
            }
        },

        // Add to the amount of a dimension
        addDimensionAmount(tier, amount) {
            const dimension = this.getDimension(tier);

            dimension.amount = dimension.amount.add(amount);
        },

        // Runs a tick of production from the dimensions
        runGameTick(tps) {
            // For each dimension, add to either the antimatter amount or the amount of the previous dimension
            this.dimensions.forEach(dimension => {
                const production = this.getDimensionProduction(dimension.tier);

                // 1st dimension makes antimatter
                if (dimension.tier === 1) {
                    this.addAntimatter(production / tps);
                } else {
                    this.addDimensionAmount(dimension.tier - 1, production / tps);
                }
            });
        }
    }
});