const db = require('../database');

/**
 * Retrieves all genres from the database, ordered by ID.
 * @returns {Promise<Object[]>} A promise resolving to an array of genres.
 */
exports.all = async () => {
  const { rows } = await db.getPool().query("SELECT * FROM genres ORDER BY id");
  return db.camelize(rows);
};

/**
 * Adds a new genre to the database.
 * @param {Object} genre - The genre object containing the name of the genre.
 * @returns {Promise<Object>} A promise resolving to the added genre.
 */
exports.add = async (genre) => {
  return db.getPool()
    .query("INSERT INTO genres(name) VALUES($1) RETURNING *", [genre.name]);
};

/**
 * Retrieves a genre by its ID from the database.
 * @param {number} id - The ID of the genre to retrieve.
 * @returns {Promise<Object>} A promise resolving to the retrieved genre.
 */
exports.get = async (id) => {
  const { rows } = await db.getPool().query("SELECT * FROM genres WHERE id = $1", [id]);
  return db.camelize(rows)[0];
};

/**
 * Updates an existing genre in the database.
 * @param {Object} genre - The updated genre object containing the name and ID of the genre.
 * @returns {Promise<Object>} A promise resolving to the updated genre.
 */
exports.update = async (genre) => {
  return await db.getPool()
    .query("UPDATE genres SET name = $1 WHERE id = $2 RETURNING *",
      [genre.name, genre.id]);
};

/**
 * Upserts a genre. If genre has an ID, updates it; otherwise, adds it.
 * @param {Object} genre - The genre object to be upserted.
 * @returns {Promise<Object>} A promise resolving to the upserted genre.
 */
exports.upsert = async (genre) => {
  if (genre.id) {
    return exports.update(genre);
  } else {
    return exports.add(genre);
  }
};
