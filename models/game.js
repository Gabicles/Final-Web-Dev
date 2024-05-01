const db = require('../database');

/**
 * Retrieves all games from the database, ordered by ID.
 * @returns {Promise<Object[]>} A promise resolving to an array of games.
 */
exports.all = async () => {
  const { rows } = await db.getPool().query('SELECT * FROM games ORDER BY id');
  return db.camelize(rows);
};

/**
 * Adds or updates a game in the database.
 * @param {Object} game - The game object to add or update.
 * @returns {Promise<Object>} A promise resolving to the added or updated game.
 */
exports.addGame = async (game) => {
  if (game.id) {
    const releaseDateUTC = new Date(game.releaseDate).toUTCString();
    await db
      .getPool()
      .query(
        'UPDATE games SET title = $1, studio = $2, release_date = $3, description = $4, image_url = $5, status = $6 WHERE id = $7',
        [
          game.title,
          game.studio,
          releaseDateUTC,
          game.description,
          game.imageUrl,
          game.status,
          game.id,
        ]
      );
    return { rowCount: 1 };
  } else {
    const releaseDateUTC = new Date(game.releaseDate).toUTCString();
    const result = await db
      .getPool()
      .query(
        'INSERT INTO games (title, studio, release_date, description, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          game.title,
          game.studio,
          releaseDateUTC,
          game.description,
          game.imageUrl,
          game.status,
        ]
      );
    return result.rows[0];
  }
};

/**
 * Retrieves a game by its ID from the database.
 * @param {number} id - The ID of the game to retrieve.
 * @returns {Promise<Object>} A promise resolving to the retrieved game.
 */
exports.get = async (id) => {
  const { rows } = await db
    .getPool()
    .query('SELECT * FROM games WHERE id = $1', [id]);
  return db.camelize(rows)[0];
};

/**
 * Retrieves comments for a specified game from the database, ordered by comment date descending.
 * @param {number} gameId - The ID of the game for which comments are to be retrieved.
 * @returns {Promise<Object[]>} A promise resolving to an array of comments for the game.
 */
exports.getComments = async (gameId) => {
  const { rows } = await db
    .getPool()
    .query(
      'SELECT * FROM games_comments WHERE game_id = $1 ORDER BY comment_date DESC',
      [gameId]
    );
  return db.camelize(rows);
};

/**
 * Adds a comment for a specified game to the database.
 * @param {number} gameId - The ID of the game.
 * @param {number} userId - The ID of the user making the comment.
 * @param {string} commentText - The text of the comment.
 * @returns {Promise<Object>} A promise resolving to the added comment.
 */
exports.addComment = async (gameId, userId, commentText) => {
  return await db
    .getPool()
    .query(
      'INSERT INTO games_comments(game_id, user_id, comment_text, comment_date) VALUES($1, $2, $3, NOW()) RETURNING *',
      [gameId, userId, commentText]
    );
};
