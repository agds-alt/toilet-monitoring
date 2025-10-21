const authCache = new Map();

export const getCachedUser = (userId: string) => {
  return authCache.get(userId);
};

export const setCachedUser = (userId: string, user: any) => {
  authCache.set(userId, user);
  setTimeout(() => authCache.delete(userId), 5 * 60 * 1000); // 5 min
};
