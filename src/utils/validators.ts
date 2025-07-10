/**
 * Valida si una cadena de texto es un correo electrónico válido.
 * @param email El correo electrónico a validar.
 * @returns `true` si el correo es válido, `false` en caso contrario.
 */
export const validateEmail = (email: string): boolean => {
const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
};

/**
 * Valida si una contraseña cumple con el requisito de longitud mínima.
 * @param password La contraseña a validar.
 * @returns `true` si la contraseña tiene al menos 8 caracteres, `false` en caso contrario.
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
