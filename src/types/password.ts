export type PasswordValidationResult = {
  length: boolean;
  hasCapitals: boolean;
  hasNumbers: boolean;
  hasSpecialCharacters: boolean;
};

export type PasswordValidationMessages = {
  [K in keyof PasswordValidationResult]: string; // K will be 'length', 'hasCapitals', etc.
};
