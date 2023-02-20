import { UserProps } from "../props";

const validateAuthInput = (user: UserProps) => {
  const errors: any = {};

  if (user.email.toString().trim() === "") {
    errors.email = "Email must not be empty";
  }
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email) === false
  ) {
    errors.email = "Email provided is not in proper format";
  }

  if (user.password.toString().trim().length < 8) {
    errors.password = "Password must be atleast 8 characters.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  validateAuthInput,
};
