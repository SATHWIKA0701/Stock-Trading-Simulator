export const avatarOptions = [
  "bull",
  "bear",
  "rocket",
  "chart",
  "diamond",
  "crown",
];

export const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());

export const isValidUsername = (name = "") =>
  /^[a-zA-Z][a-zA-Z0-9 _-]{2,29}$/.test(name.trim());

export const isStrongPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/.test(password);

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const normalizeUsername = (name = "") =>
  name.trim().replace(/\s+/g, " ");

export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  balance: user.balance,
});
