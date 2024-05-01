const db = require('../database');

/**
 * Adds a new comment to the database.
 * @param {Object} comment - The comment object containing comment, userId, and bookId.
 * @returns {Promise<Object>} A promise resolving to the result of the database query.
 */
exports.add = async (comment) => {
  return await db.getPool()
    .query(`INSERT INTO comments(comment, user_id, book_id, created_at)
            VALUES($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
      [comment.comment, comment.userId, comment.bookId]);
};

/**
 * Updates an existing comment in the database.
 * @param {Object} comment - The updated comment object containing comment and id.
 * @returns {Promise<Object>} A promise resolving to the result of the database query.
 */
exports.update = async (comment) => {
  return await db.getPool()
    .query("UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *",
      [comment.comment, comment.id]);
};

/**
 * Upserts a comment. If comment has an ID, updates it; otherwise, adds it.
 * @param {Object} comment - The comment object to be upserted.
 */
exports.upsert = (comment) => {
  if (comment.id) {
    exports.update(comment);
  } else {
    exports.add(comment);
  }
};

/**
 * Retrieves a comment by its ID from the database.
 * @param {number} id - The ID of the comment to retrieve.
 * @returns {Promise<Object>} A promise resolving to the retrieved comment.
 */
exports.get = async (id) => {
  const { rows } = await db.getPool().query("SELECT * FROM comments WHERE id = $1", [id]);
  return db.camelize(rows)[0];
};

/**
 * Retrieves all comments for a specified book from the database.
 * @param {Object} book - The book object for which comments are to be retrieved.
 * @returns {Promise<Object[]>} A promise resolving to an array of comments for the book.
 */
exports.allForBook = async (book) => {
  const { rows } = await db.getPool().query(`
    SELECT comments.*, users.email AS user_email, users.id AS user_id
    FROM comments
    LEFT JOIN users ON users.id = comments.user_id
    WHERE book_id = $1;
  `, [book.id]);
  return db.camelize(rows);
};
