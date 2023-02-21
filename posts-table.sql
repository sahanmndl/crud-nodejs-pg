-- Database: social-media

-- DROP DATABASE IF EXISTS "social-media";

CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);