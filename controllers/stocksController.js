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

exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT * FROM StockTransactions 
            WHERE id = ?
        `;

        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const stock = results[0];
        stock.purchase_price = stock.purchase_price / 100;
        stock.sale_price = stock.sale_price / 100;

        res.json(stock);

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, purchase_price, sale_price } = req.body;

        const purchasePriceInCents = parseFloat(purchase_price) * 100;
        const salePriceInCents = parseFloat(sale_price) * 100;

        if (isNaN(purchasePriceInCents) || isNaN(salePriceInCents)) {
            return res.status(400).json({ error: "Invalid price. It must be a number." });
        }

        const query = `
            UPDATE StockTransactions 
            SET company = ?, purchase_price = ?, sale_price = ?
            WHERE id = ?
        `;

        await db.query(query, [company, purchasePriceInCents, salePriceInCents, id]);

        res.json({ message: "Transaction updated successfully" });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM StockTransactions 
            WHERE id = ?
        `;

        await db.query(query, [id]);

        res.json({ message: "Transaction deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};
