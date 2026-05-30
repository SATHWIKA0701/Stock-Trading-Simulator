export const formatMoney = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

export const formatPercent = (value) =>
  `${Number(value || 0).toFixed(2).replace(/\.00$/, "")}%`;

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const saveStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("user-updated"));
};
