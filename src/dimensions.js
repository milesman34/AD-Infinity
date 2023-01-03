// Class for a given normal dimension
export const Dimension = ({type, cost, costMultiplier}) => ({
    // Type of dimension (1st, 2nd, etc)
    type,

    // Initial cost of dimension
    initialCost: cost,

    // Cost of dimension
    cost() {
        return this.initialCost.times(this.costMultiplier.pow(this.purchases))
    },
    
    // Amount dimension cost increases by
    costMultiplier,

    // Number of purchases of this dimension
    purchases: 0,

    // Amount of current dimension
    amount: new Decimal(0)
});