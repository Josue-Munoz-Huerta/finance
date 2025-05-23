const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM movements');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        const [result] = await db.query(
            'INSERT INTO movements (description, amount, type, category, date) VALUES (?, ?, ?, ?, ?)',
            [description, amount, type, category, date]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Añade estos métodos básicos para completar:
exports.getById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM movements WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Movement not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        await db.query(
            'UPDATE movements SET description = ?, amount = ?, type = ?, category = ?, date = ? WHERE id = ?',
            [description, amount, type, category, date, req.params.id]
        );
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await db.query('DELETE FROM movements WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};