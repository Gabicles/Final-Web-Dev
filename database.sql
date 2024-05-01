SET client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS  authors (
    id serial primary key,
    first_name varchar,
    last_name varchar
);

CREATE TABLE IF NOT EXISTS  authors_books (
    id serial primary key,
    author_id bigint,
    book_id bigint
);

CREATE TABLE IF NOT EXISTS  books (
    id serial primary key,
    title varchar,
    genre_id bigint,
    publishing_year integer
);

CREATE TABLE IF NOT EXISTS  books_users (
    id serial primary key,
    user_id bigint,
    book_id bigint,
    read_status varchar
);

CREATE TABLE IF NOT EXISTS  comments (
    id serial primary key,
    user_id bigint,
    book_id bigint,
    comment varchar,
    created_at timestamp without time zone
);
CREATE TABLE IF NOT EXISTS  genres (
    id serial primary key,
    name varchar
);

CREATE TABLE IF NOT EXISTS  users (
    id serial primary key,
    name varchar,
    email varchar,
    password varchar,
    salt varchar
);


CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    studio VARCHAR,
    release_date DATE,
    description TEXT,
    image_url VARCHAR,
    status VARCHAR
);


CREATE TABLE IF NOT EXISTS studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    foundation_year INTEGER,
    description TEXT,
    image_url VARCHAR
);

CREATE TABLE games_comments (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id),
    user_id INTEGER,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP NOT NULL CURRENT_TIMESTAMP
);