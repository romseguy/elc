const errorCodes = {
  DUPLICATE_KEY: 11000,
};

export const handleError = (error) => {
  console.log(`MONGOOSE_ERROR code: ${error.code} message: ${error.message}`);
  let errors = {};

  if (error.code === errorCodes.DUPLICATE_KEY) {
    errors = { error: "Une fiche existe déjà pour cet élève" };
  } else if (error.name === "ValidationError") {
    /*
        When we send a request body like this:
        {
            "email": "test",
            "password": "abc"
        }
        Response will be:
        {
            "email": "Please enter a valid E-mail!",
            "password": "Length of the password should be between 6-1000"
        }
    */
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
  }

  return errors;
};
