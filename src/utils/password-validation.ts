import { PasswordValidationMessages } from "@/types/password";

export const passwordValidationMessage: PasswordValidationMessages = {
  length: "Minimum 8 characters",
  hasCapitals: "At least 1 uppercase letter",
  hasNumbers: "At least 1 number",
  hasSpecialCharacters: "At least 1 special character",
};

export const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    hasCapitals: /[A-Z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialCharacters: /[^a-zA-Z0-9]/.test(password),
  };
};
