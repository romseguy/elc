export const handleError = (error, setError) => {
  if (error.message)
    return setError("formErrorMessage", {
      type: "manual",
      message: error.message
    });

  const fields = Object.keys(error);

  if (!fields.length)
    return setError("formErrorMessage", {
      type: "manual",
      message: "Une erreur est survenue, veuillez contacter le développeur"
    });

  fields.forEach((field) => {
    setError(field, { type: "manual", message: error[field] });
  });
};
