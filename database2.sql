CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    salt VARCHAR
);

CREATE TABLE IF NOT EXISTS studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    foundation_year INTEGER,
    description TEXT,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    studio VARCHAR,
    release_date TIMESTAMP WITHOUT TIME ZONE,
    description TEXT,
    image_url VARCHAR,
    status VARCHAR
);

CREATE TABLE IF NOT EXISTS calendar (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    comment_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS games_comments (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id),
    user_id INTEGER, 
    comment_text TEXT ,
    comment_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR
);

CREATE TABLE IF NOT EXISTS authors_books (
    id SERIAL PRIMARY KEY,
    author_id BIGINT,
    book_id BIGINT
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    genre_id BIGINT,
    publishing_year INTEGER
);

CREATE TABLE IF NOT EXISTS books_users (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    book_id BIGINT,
    read_status VARCHAR
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    book_id BIGINT,
    comment VARCHAR,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR
);
