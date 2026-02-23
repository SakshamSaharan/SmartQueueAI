const { v4: uuidv4 } = require("uuid");

/**
 * Generates a short unique token like "A-3F9C2A"
 */
module.exports = function generateToken() {
    const id = uuidv4().replace(/-/g, "").slice(0, 6).toUpperCase();
    return "A-" + id;
};
