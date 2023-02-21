import pool from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body
        const hash = await bcrypt.hash(password, 10)
        const result = await pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id', [email, hash, name])
        const user = { id: result.rows[0].id, email: email, name: name }
        //const token = jwt.sign({ user }, 'secret_key')
        res.status(201).json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]
        if (user && await bcrypt.compare(password, user.password)) {
            //const token = jwt.sign({ user: { id: user.id, email: user.email } }, 'secret_key');
            res.status(201).json({ user })
        } else {
            res.status(401).json({ message: 'Invalid login credentials' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}