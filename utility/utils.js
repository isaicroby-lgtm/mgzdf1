export const filterList = (list, query, keys) => {
  if (!list) return [];
  if (!query) return list;
  return list.filter((item) => {
    return keys.some((key) => {
      return item[key] && item[key].toLowerCase().includes(query.toLowerCase());
    });
  });
};
