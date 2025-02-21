const db = require('../config/db');

exports.getFilteredTransactions = async (req, res) => {
    try {
        const { symbol, price, operator } = req.params;
        const priceInCents = parseFloat(price) * 100;

        if (isNaN(priceInCents)) {
            return res.status(400).json({ error: "Invalid price. It must be a number." });
        }

        if (operator !== "greater" && operator !== "less") {
            return res.status(400).json({ error: "Invalid operator. Use 'greater' or 'less'." });
        }

        const query = `
            SELECT * FROM StockTransactions 
            WHERE company = ? AND sale_price ${operator === "greater" ? ">" : "<"} ?
        `;

        const [results] = await db.query(query, [symbol, priceInCents]);

        res.json({
            filter: { price, operator, symbol, priceInCents },
            stocks: results.map(stock => ({
                ...stock,
                purchase_price: stock.purchase_price / 100,
                sale_price: stock.sale_price / 100
            }))
        });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const query = 'SELECT * FROM StockTransactions';
        const [results] = await db.query(query);

        res.json({
            stocks: results.map(stock => ({
                ...stock,
                purchase_price: stock.purchase_price / 100,
                sale_price: stock.sale_price / 100
            }))
        });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};
