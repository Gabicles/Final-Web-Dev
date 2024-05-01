const db = require('../database');

/**
 * Adds a comment date for a specified user to the database.
 * @param {number} userId - The ID of the user.
 * @param {Date} commentDate - The date of the comment.
 * @returns {Promise<object>} A promise resolving to the result of the database query.
 */
exports.addCommentDate = async (userId, commentDate) => {
  return await db
    .getPool()
    .query(
      'INSERT INTO calendar(user_id, comment_date) VALUES($1, $2) RETURNING *',
      [userId, commentDate]
    );
};

/**
 * Retrieves comment dates for a specified user from the database, ordered by date descending.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object[]>} A promise resolving to an array of comment dates.
 */
exports.getCommentDatesByUserId = async (userId) => {
  const { rows } = await db
    .getPool()
    .query(
      'SELECT * FROM games_comments WHERE user_id = $1 ORDER BY comment_date DESC',
      [userId]
    );
  return db.camelize(rows);
};
