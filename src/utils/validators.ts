import { UserProps } from "../props";

const validateAuthInput = (user: UserProps) => {
  const errors: any = {};
  if (user.email.toString().trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    if (user.password.toString().length > 8) {
      errors.password = "Contact must be atleast 8 characters.";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  validateAuthInput,
};
