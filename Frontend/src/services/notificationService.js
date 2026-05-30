import api from "./api";

export const getNotifications = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const markAllRead = async () => {
  const token = localStorage.getItem("token");

  const res = await api.put(
    "/notifications/mark-read",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};