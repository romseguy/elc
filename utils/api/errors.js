const databaseErrorCodes = {
  DUPLICATE_KEY: 11000,
};

/**
 * Make database errors friendly
 * @param {Error} error
 * @returns {
 *   "message": "",
 * }
 */
export const createDatabaseError = (error) => {
  if (error.code) {
    if (error.code === databaseErrorCodes.DUPLICATE_KEY) {
      return { message: "Une fiche existe déjà pour cet élève" };
    }
  }
};

/**
 * @param {Error} error
 * @returns {
 *   "email": "Please enter a valid E-mail!",
 *   "password": "Length of the password should be between 6-1000"
 * }
 */
export const createValidationError = (error) => {
  let validationError = {};

  Object.keys(error).forEach((key) => {
    validationError[key] = error[key].message;
  });

  return validationError;
};

/**
 * Make server (api, database) errors friendly to the client
 * @param {Error} error
 * @returns {
 *   "message": error.message
 * }
 */
export const createServerError = (error) => {
  if (error.code) return createDatabaseError(error);
  if (error.name === "ValidationError") return createValidationError(error);
  if (error.message) return { message: error.message };

  console.error(error);
};
