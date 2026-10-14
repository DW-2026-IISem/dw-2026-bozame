export class SaleMapper {
    static toResponse(s) {
        return {
            id: s.id,
            saleDate: s.saleDate,
            subtotal: s.subtotal,
            tax: s.tax,
            discounts: s.discounts,
            total: s.total,
            status: s.status,
            clientId: s.clientId,
            items: s.items.map((it) => ({
                id: it.id,
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                total: it.total,
            })),
        };
    }
}
//# sourceMappingURL=sale.mapper.js.map