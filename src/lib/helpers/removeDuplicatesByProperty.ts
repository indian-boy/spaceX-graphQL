/**
 * Remove duplicates by property
 * @param {string} property - List property identifier.
 * @param {T[]} oldList - Old list
 * @param {T[]} newList - New list
 * @returns {T[]} Returns a new list without duplicates by property passed
 */
export const removeDuplicatesByProperty = <T>(
  property: keyof T,
  oldList: T[] = [],
  newList: T[] = []
): T[] => {
  const impureList = [...oldList, ...newList];

  const previousValueSet = new Map(
    impureList.map((value) => [value[property], value])
  );

  return Array.from(previousValueSet.values());
};
