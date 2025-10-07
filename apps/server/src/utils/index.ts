export const generateUniqueId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const getLastPage = (headers: Response['headers']) => {
  const link = headers?.get('link')?.split(',').reverse()[0];
  const regex = /page=(\d+)/;
  const match = regex.exec(link || '');
  return match ? Number(match[1]) : null;
};
