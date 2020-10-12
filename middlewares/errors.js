export const databaseErrorCodes = {
  DUPLICATE_KEY: 11000
};

export const databaseErrorMessages = {};

/**
 * @param {Error} error
 * @returns {
 *   "email": "Field is required",
 * }
 */
export const createValidationError = (error) => {
  if (error.errors) {
    const errors = {};
    Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });
    return errors;
  }
  return { [error.errors.name.path]: error.errors.name.message };
};

/**
 * Make server (api, database) errors friendly to the client
 * @param {Error} error
 * @returns {
 *   "message": error.message
 * }
 */
export const createServerError = (error) => {
  if (error.name === "ValidationError") return createValidationError(error);

  if (error.code && databaseErrorMessages[error.code]) {
    return new Error(databaseErrorMessages[error.code]);
  }

  return { message: error.message };
};
