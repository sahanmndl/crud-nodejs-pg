import pool from "../index.js";

export const getAllPosts = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY id DESC ');
        res.status(200).json({ posts: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createPost = async (req, res, next) => {
    try {
        const { title, content, user_id } = req.body
        const getUser = await (await pool.query('SELECT * FROM users WHERE id = $1', [user_id])).rows[0]
        console.log(getUser)
        if(!getUser) {
            res.status(400).json({message: "User not found!"})
        } else {
            const result = await pool.query('INSERT INTO posts (user_id, title, content, user_name) VALUES ($1, $2, $3, $4) RETURNING id, created_at', [user_id, title, content, getUser.name]);
            res.status(200).json({ id: result.rows[0].id, user: getUser, title: title, content: content, created_at: result.rows[0].created_at });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { title, content, user_id } = req.body
        const getUser = await (await pool.query('SELECT * FROM users WHERE id = $1', [user_id])).rows[0]
        //console.log(getUser)
        if(!getUser) {
            res.status(400).json({message: "User not found!"})
        } else {
            const result = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING id', [title, content, req.params.id, user_id]);
            if(result.rowCount === 0) {
                res.status(403).json({ message: 'You are not authorized to update this post' })
            } else {
                res.status(200).json({ id: result.rows[0].id, user: getUser, title: title, content: content, created_at: result.rows[0].created_at });
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const post_id = req.params.id
        const { user_id } = req.body
        const getUser = await (await pool.query('SELECT * FROM users WHERE id = $1', [user_id])).rows[0]
        //console.log(getUser)
        if(!getUser) {
            res.status(400).json({message: "User not found!"})
        } else {
            console.log(post_id, user_id)
            const result = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id', [post_id, user_id])
            if(result.rowCount === 0) {
                res.status(403).json({ message: 'You are not authorized to update this post' })
            } else {
                res.status(200).json({ message: "Post deleted successfully!" });
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}