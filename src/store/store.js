import { defineStore } from "pinia";

import { Dimension } from "../dimensions.js";

import Decimal from "break_infinity.js";

// Core store for the game
export const useGameStore = defineStore("game", {
    state: () => ({
        // Current amount of antimatter
        antimatter: new Decimal(10),

        // Number of dimboosts purchased
        dimboosts: 0,

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
        ],

        tickspeed: {
            cost: new Decimal(1e3),
            purchases: 0
        },

        // Number of first dimensions sacrificed
        sacrificedFirsts: new Decimal("0"),

        // Is the game over?
        isGameOver: false,

        // Game interval to use
        interval: null,

        // Number of ticks since the last save
        ticksSinceSave: 0
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

        // Gets the number of purchases the player has made on the current 10 of a dimension
        getDimensionPurchasesOnCurrent10: state => tier => state.getDimensionPurchases(tier) % 10,

        // Gets the number of purchases the player has to make to reach the next set of 10 dimensions
        getRemainingDimensionPurchasesForCurrent10: state => tier => 10 - state.getDimensionPurchasesOnCurrent10(tier),

        // Gets the current cost of a dimension
        getDimensionCost: state => tier => {
            const dimension = state.getDimension(tier);

            return dimension.startingCost.times(dimension.costMultiplier.pow(state.getDimension10xPurchases(tier)));
        },

        // Gets the cost of buying until 10 of a dimension
        getDimensionCostUntil10: state => tier => {
            let purchased = state.getDimensionPurchasesOnCurrent10(tier);
            return state.getDimensionCost(tier).times(10 - purchased);
        },

        // Can the player afford buying a dimension
        canAffordDimension: state => tier => state.antimatter.gte(state.getDimensionCost(tier)),

        // Can the player afford buying a dimension until 10
        canAffordDimensionUntil10: state => tier => state.antimatter.gte(state.getDimensionCostUntil10(tier)),

        // Gets the number of dimboosts needed to unlock a dimension
        getRequiredDimboostsToUnlock: () => tier =>
            tier <= 4 ? 0 : tier - 4,

        // Gets the multiplier from dimboosts on a dimension
        getDimboostMultiplier: state => tier => {
            // Number of times the 2x multiplier should happen
            //  3 dimboosts + 1st dimension = 3 (8x multi)
            const multiTimes = Math.max((state.dimboosts - tier) + 1, 0);

            return new Decimal(2).pow(multiTimes);
        },

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

        // Has the player purchased at least 1 of a dimension
        hasPlayerPurchasedDimension: state => tier => state.getDimensionPurchases(tier) > 0,

        // Checks if a dimension is unlocked
        isDimensionUnlocked: state => tier => {
            if (tier === 1) { // tier 1 always unlocked
                return true;
            } else {
                // Check if the player has bought the previous dimension and has bought enough dimboosts to unlock this dimension
                return state.hasPlayerPurchasedDimension(tier - 1) && state.dimboosts >= state.getRequiredDimboostsToUnlock(tier);
            }
        },

        // Checks if tickspeed is unlocked
        tickspeedUnlocked: state => state.hasPlayerPurchasedDimension(2),

        // Gets the multiplier of a dimension
        getDimensionMultiplier: state => tier => {
            // Base production w/o tickspeed
            let baseProduction = new Decimal(2).pow(state.getDimension10xPurchases(tier)).times(state.getSacrificeMultiplier(tier));

            return baseProduction.times(state.getDimboostMultiplier(tier));
        },

        // Gets the effective production from a dimension
        getDimensionProduction: state => tier => {
            // Base production w/o tickspeed
            let baseProduction = state.getDimensionAmount(tier).times(state.getDimensionMultiplier(tier));

            // Apply tickspeed
            return baseProduction.times(state.currentTickspeedEffect);
        },

        // Gets the antimatter production per second
        antimatterProduction: state => state.getDimensionProduction(1),

        // Gets all unlocked dimensions
        unlockedDimensions: state => state.dimensions.filter(dim => state.isDimensionUnlocked(dim.tier)),

        // Gets the number of tickspeed purchases
        tickspeedPurchases: state => state.tickspeed.purchases,

        // Gets the current tickspeed
        currentTickspeed: state => new Decimal(1000).times(new Decimal(1 - state.tickspeedUpgradePower).pow(state.tickspeedPurchases)),

        // Gets the current multiplier based on tickspeed
        currentTickspeedEffect: state => new Decimal(1000).div(state.currentTickspeed),

        // Gets the cost of the tickspeed upgrade
        tickspeedCost: state => state.tickspeed.cost.times(new Decimal(10).pow(state.tickspeedPurchases)),

        // Can the player afford a tickspeed upgrade
        canAffordTickspeed: state => state.antimatter.gte(state.tickspeedCost),

        // Gets the current boost per tickspeed upgrade
        tickspeedUpgradePower: state => state.galaxies === 0 ? new Decimal(0.11) : state.galaxies === 1 ? new Decimal(0.12) : new Decimal(0.14),

        // Gets the number and tier of dimensions needed for the next dimboost
        dimboostCost: state => {
            // Dimension shifts
            if (state.dimboosts < 4) {
                return {
                    amount: new Decimal(20),
                    tier: state.dimboosts + 4
                }
            } else {
                // Dimension boosts
                return {
                    amount: new Decimal(20).add((state.dimboosts - 4) * 15),
                    tier: 8
                }
            }
        },

        // Can the player afford to dimboost?
        canAffordDimboost: state => {
            const cost = state.dimboostCost;

            return state.getDimensionAmount(cost.tier).gte(cost.amount);
        },

        // Gets the cost of the next galaxy
        galaxyCost: state => {
            return 20 + (state.galaxies + 1) * 60;
        },

        // Can the player afford a galaxy?
        canAffordGalaxy: state => state.getDimensionAmount(8).gte(state.galaxyCost),

        // Checks if sacrifice is unlocked
        sacrificeUnlocked: state => state.dimboosts >= 5,

        // Returns the formula for the dimensional sacrifice boost
        sacrificePowerFormula: () => firsts => Decimal.max(new Decimal(Decimal.log10(firsts)).div(10), new Decimal(1)).pow(2),

        // Current sacrifice boost
        currentSacrificePower: state => state.sacrificePowerFormula(state.sacrificedFirsts),

        // Gets the current boost from the next sacrifice
        currentBoostOnSacrifice: state => {
            const nextPower = state.sacrificePowerFormula(state.getDimensionAmount(1));

            return Decimal.max(nextPower.div(state.currentSacrificePower), new Decimal(1));
        },

        // Checks if the player can dimensional sacrifice
        canPlayerSacrifice: state => state.sacrificeUnlocked && state.getDimensionAmount(8).gt(0) && state.currentBoostOnSacrifice.gte(1.01),

        // Gets the multiplier to a dimension from sacrifice
        getSacrificeMultiplier: state => tier => tier === 8 ? state.currentSacrificePower : 1,

        // Did the player reach infinity
        reachedInfinity: state => state.antimatter.gte(Decimal.NUMBER_MAX_VALUE)
    },

    actions: {
        // Sets the game interval
        setInterval(interval) {
            this.interval = interval;
        },

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

            if (this.isDimensionUnlocked(tier) && this.antimatter.gte(cost)) {
                this.subtractAntimatter(cost);

                // Add 1 purchase
                dimension.purchases++;

                // Add 1 to the amount
                this.addDimensionAmount(tier, 1);
            }
        },

        // Buys a dimension until 10 if it is affordable
        buyDimensionUntil10(tier) {
            const cost = this.getDimensionCostUntil10(tier);
            const dimension = this.getDimension(tier);

            if (this.isDimensionUnlocked(tier) && this.antimatter.gte(cost)) {
                this.subtractAntimatter(cost);

                // Figure out how many purchases are needed
                const neededPurchases = this.getRemainingDimensionPurchasesForCurrent10(tier);

                // Add these purchases to the purchases + amounts
                dimension.purchases += neededPurchases;
                this.addDimensionAmount(tier, neededPurchases);
            }
        },

        // Buys a tickspeed upgrade if it is affordable
        buyTickspeed() {
            const cost = this.tickspeedCost;

            if (this.tickspeedUnlocked && this.antimatter.gte(cost)) {
                this.subtractAntimatter(cost);
                this.addTickspeedAmount(1);
            }
        },

        // Buys the max number of tickspeed upgrades
        buyMaxTickspeed() {
            if (!this.tickspeedUnlocked || this.reachedInfinity) {
                return;
            }

            while (this.canAffordTickspeed) {
                this.buyTickspeed();
            }
        },

        // Buys the maximum number of dimensions/tickspeed upgrades
        buyMax() {
            if (this.reachedInfinity) {
                return;
            }

            // time for the lazy option of buying all dimensions in order (8th first though), then tickspeed
            let order = [8, 1, 2, 3, 4, 5, 6, 7];

            order.forEach(tier => {
                if (!this.isDimensionUnlocked(tier)) {
                    return;
                }

                while (this.canAffordDimensionUntil10(tier)) {
                    this.buyDimensionUntil10(tier);
                }
            });

            this.buyMaxTickspeed();
        },

        // Resets dimension amounts/purchases
        resetDimensions() {
            this.dimensions.forEach(dimension => {
                dimension.amount = new Decimal(0);
                dimension.purchases = 0;
            });

            // Reset antimatter
            this.antimatter = new Decimal(10);

            // Reset tickspeed purchases
            this.tickspeed.purchases = 0;
        },

        // Buys a dimboost if it is affordable
        buyDimboost() {
            if (this.canAffordDimboost) {
                this.dimboosts++;

                // Now we reset dimension amounts/purchases
                this.resetDimensions();
                this.sacrificedFirsts = new Decimal(0);
            }
        },

        // Buys a galaxy if it is affordable
        buyGalaxy() {
            if (this.canAffordGalaxy) {
                this.galaxies++;
                this.dimboosts = 0;

                this.resetDimensions();
                this.sacrificedFirsts = new Decimal(0);
            }
        },

        // Does a dimensional sacrifice
        dimensionalSacrifice() {
            if (this.canPlayerSacrifice) {
                // Reset all dimension amounts (not purchased) except 8th
                // Add to sacrified firsts
                this.sacrificedFirsts = this.sacrificedFirsts.add(this.getDimensionAmount(1));

                this.dimensions.forEach(dimension => {
                    if (dimension.tier < 8) {
                        dimension.amount = new Decimal(0);
                    }
                });
            }
        },

        // Add to the amount of a dimension
        addDimensionAmount(tier, amount) {
            const dimension = this.getDimension(tier);

            dimension.amount = dimension.amount.add(amount);
        },

        // Adds to the tickspeed amount
        addTickspeedAmount(amount) {
            this.tickspeed.purchases += amount;
        },

        // Runs a tick of production from the dimensions
        runGameTick(tps, boost) {
            // For each dimension, add to either the antimatter amount or the amount of the previous dimension
            this.dimensions.forEach(dimension => {
                const production = this.getDimensionProduction(dimension.tier);

                // 1st dimension makes antimatter
                if (dimension.tier === 1) {
                    this.addAntimatter(production / (tps * boost));
                } else {
                    this.addDimensionAmount(dimension.tier - 1, production / (tps * boost));
                }
            });

            // Updates time of last tick
            this.ticksSinceSave++;

            if (this.reachedInfinity) {
                this.isGameOver = true;
                clearInterval(this.interval);

                // Reset game data
                this.resetDimensions();
                this.dimboosts = 0;
                this.galaxies = 0;
                this.sacrificedFirsts = new Decimal(0);
                this.saveUserData();
            }
        },

        // Saves user data to localStorage
        saveUserData() {
            localStorage.setItem("save", JSON.stringify({
                antimatter: this.antimatter,
                dimboosts: this.dimboosts,
                galaxies: this.galaxies,
                dimensions: this.dimensions,
                tickspeedPurchases: this.tickspeed.purchases,
                sacrificedFirsts: this.sacrificedFirsts
            }));

            // Update time of last save
            this.ticksSinceSave = 0;
        },

        // Loads user data from localStorage
        loadUserData() {
            const save = localStorage.getItem("save");

            if (save !== null) {
                const json = JSON.parse(save);
                
                this.antimatter = new Decimal(json.antimatter);
                this.dimboosts = json.dimboosts;
                this.galaxies = json.galaxies;
                this.sacrificedFirsts = new Decimal(json.sacrificedFirsts);
                this.tickspeed.purchases = json.tickspeedPurchases;

                json.dimensions.forEach((dimension, index) => {
                    let dim = this.dimensions[index];
                    dim.purchases = dimension.purchases;
                    dim.amount = new Decimal(dimension.amount);
                });
            }
        }
    }
});