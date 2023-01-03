// Class for a given normal dimension
export const Dimension = ({type, cost, costMultiplier}) => ({
    // Tier of dimension (1st, 2nd, etc)
    tier,

    // Initial cost of dimension
    initialCost: cost,
    
    // Amount dimension cost increases by
    costMultiplier,

    // Number of purchases of this dimension
    purchases: 0,

    // Amount of current dimension
    amount: new Decimal(0)

    // // Cost of dimension
    // cost() {
    //     return this.initialCost.times(this.costMultiplier.pow(this.purchases))
    // },

    // // Number of dimboosts needed to unlock this dimension
    // requiredDimboostsToUnlock() {
    //     return this.type <= 4 ? 0 : this.type - 4;
    // },

    // // Is this dimension unlocked?
    // isUnlocked() {
    //     return store.dimBoosts >= this.requiredDimboostsToUnlock();
    // }
});

// ok yeah i'm going to want to replace this with getters probably