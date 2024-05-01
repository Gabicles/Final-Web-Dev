const db = require("../database");

/**
 * Retrieves all studios from the database, ordered by ID.
 * @returns {Promise<Object[]>} A promise resolving to an array of studios.
 */
exports.all = async () => {
  const { rows } = await db.getPool().query("SELECT * FROM studios ORDER BY id");
  return db.camelize(rows);
};

/**
 * Adds a new studio to the database.
 * @param {Object} studio - The studio object containing name, foundation year, description, and image URL.
 * @returns {Promise<Object>} A promise resolving to the added studio.
 */
exports.addStudio = async (studio) => {
  return await db.getPool()
    .query("INSERT INTO studios(name, foundation_year, description, image_url) VALUES($1, $2, $3, $4) RETURNING *",
      [studio.name, studio.foundationYear, studio.description, studio.imageUrl]);
};

/**
 * Retrieves a studio by its ID from the database.
 * @param {number} id - The ID of the studio to retrieve.
 * @returns {Promise<Object>} A promise resolving to the retrieved studio.
 */
exports.get = async (id) => {
  const { rows } = await db.getPool().query("SELECT * FROM studios WHERE id = $1", [id]);
  return db.camelize(rows)[0];
};

/**
 * Retrieves games developed by a specified studio from the database, ordered by ID.
 * @param {number} studioId - The ID of the studio for which games are to be retrieved.
 * @returns {Promise<Object[]>} A promise resolving to an array of games developed by the studio.
 */
exports.getGames = async (studioId) => {
  const { rows } = await db.getPool().query("SELECT * FROM games WHERE studio = $1 ORDER BY id", [studioId]);
  return db.camelize(rows);
};

/**
 * Links a game to a studio in the database.
 * @param {number} gameId - The ID of the game to link.
 * @param {number} studioId - The ID of the studio to which the game is linked.
 */
exports.linkGame = async (gameId, studioId) => {
  await db
    .getPool()
    .query('UPDATE games SET studio = $1 WHERE id = $2', [studioId, gameId]);
};
