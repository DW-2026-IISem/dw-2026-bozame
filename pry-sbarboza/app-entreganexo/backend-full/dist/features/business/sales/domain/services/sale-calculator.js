export class SaleCalculator {
    subtotal(items) {
        return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    }
    total(subtotal, tax, discounts) {
        return subtotal + tax - discounts;
    }
}
//# sourceMappingURL=sale-calculator.js.map