const validator = require("validator");
const bcrypt = require("bcrypt")
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};
const validateProfileEditData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))

  return isEditAllowed
}
const validateUpdatePassword = async (req) => {
  const { currentPassword, updatedPassword } = req.body;

  // 1. Required fields check
  if (!currentPassword || !updatedPassword) {
    throw new Error("Current password and new password are required");
  }

  // 2. Verify current password
  const isMatch = await bcrypt.compare(currentPassword, req.user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // 3. Strong password validation
  if (
    !validator.isStrongPassword(updatedPassword)
  ) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
    );
  }

  // 4. Prevent using the same password
  if (currentPassword === updatedPassword) {
    throw new Error("New password must be different from current password");
  }



  return true;
};


module.exports = {
  validateSignUpData, validateProfileEditData, validateUpdatePassword
};
