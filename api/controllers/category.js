import { db } from "../connect.js";

export const categoryAdd = async (req, res) => {
    const { category } = req.body;
    if (!category) {
        return res.status(400).json({ message: 'Categoria inválida' });
    }
    const query = 'INSERT INTO categories (name) VALUES (?)';
    db.query(query, [category], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Categoria já existe' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Categoria adicionada com sucesso' });
    });
};

export const categoryRemove = async (req, res) => {
    const { category } = req.query;
    if (!category) {
        return res.status(400).json({ message: 'Categoria inválida' });
    }
    const query = 'DELETE FROM categories WHERE name = ?';
    db.query(query, [category], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Categoria removida com sucesso' });
    });    
};

export const categorySee = async (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};