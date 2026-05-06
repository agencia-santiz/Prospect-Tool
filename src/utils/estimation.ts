

// Removed Revenue Estimation Logic as per request.
// This file is kept minimal if future utils are needed.

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    }).format(value);
};
