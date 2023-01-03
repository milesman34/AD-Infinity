// Class for a given normal dimension
export const Dimension = ({tier, cost, costMultiplier}) => ({
    // Tier of dimension (1st, 2nd, etc)
    tier,

    // Initial cost of dimension
    startingCost: cost,
    
    // Amount dimension cost increases by
    costMultiplier,

    // Number of purchases of this dimension
    purchases: 0,

    // Amount of current dimension
    amount: new Decimal(0)
});