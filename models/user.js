const db = require('../database');
const crypto = require('crypto');

/**
 * Generates a random salt.
 * @returns {string} A random salt.
 */
const createSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Encrypts a password using PBKDF2 with a given salt.
 * @param {string} password - The password to encrypt.
 * @param {string} salt - The salt used for encryption.
 * @returns {string} The encrypted password.
 */
const encryptPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
};

/**
 * Adds a new user to the database.
 * @param {Object} user - The user object containing email, name, and password.
 * @returns {Promise<Object>} A promise resolving to the added user.
 */
exports.add = async (user) => {
  let salt = createSalt();
  let encryptedPassword = encryptPassword(user.password, salt);
  return db.getPool()
    .query("INSERT INTO users(email, name, salt, password) VALUES($1, $2, $3, $4) RETURNING *",
      [user.email, user.name, salt, encryptedPassword]);
};

/**
 * Retrieves a user by their email from the database.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object>} A promise resolving to the retrieved user.
 */
exports.getByEmail = async (email) => {
  const { rows } = await db.getPool().query("SELECT * FROM users WHERE email = $1", [email]);
  return db.camelize(rows)[0];
};

/**
 * Logs in a user by verifying their email and password.
 * @param {Object} login - The login object containing email and password.
 * @returns {Promise<Object|null>} A promise resolving to the logged-in user or null if login fails.
 */
exports.login = async (login) => {
  let user = await exports.getByEmail(login.email);
  if (!user) {
    return null;
  }
  let encryptedPassword = encryptPassword(login.password, user.salt);
  if (user.password === encryptedPassword) {
    return user;
  }
  return null;
};
