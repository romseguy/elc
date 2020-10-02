export const handleError = (error, setError) => {
  if (error.message)
    setError("formErrorMessage", {
      type: "manual",
      message: error.message
    });
  else
    Object.keys(error).forEach((field) => {
      setError(field, { type: "manual", message: error[field] });
    });
};
