/**
 * Purify list removing duplicates keys
 * @param {string} key - List key identifier.
 * @param {T[]} oldList - Old list
 * @param {T[]} newList - New list
 * @returns {T[]} Returns a purified list
 */
export const purifyListByKey = <T>(
  key: keyof T,
  oldList: T[] = [],
  newList: T[] = []
): T[] => {
  const impureList = [...oldList, ...newList];

  const previousValueSet = new Map(
    impureList.map((value) => [value[key], value])
  );

  return Array.from(previousValueSet.values());
};
