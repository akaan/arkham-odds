/**
 * Returns a new array with the first occurrence of an element removed from
 * the array passed.
 *
 * @param {T[]} elems
 *   The original array.
 * @param {T} elem
 *   The element to remove
 * @return {T[]}
 *   A new array with the element removed if original array contained it.
 */
export function removeFirst<T>(elems: T[], elem: T): T[] {
  let found = false;
  return elems.filter((e) => {
    if (found) {
      return true;
    } else {
      if (e === elem) {
        found = true;
        return false;
      } else {
        return true;
      }
    }
  });
}

function tails<T>(elems: T[]): T[][] {
  if ( elems.length === 0 ) { return [ [] ]; }

  const a = tails (elems.slice(1));
  a.unshift(elems.slice(0));
  return a;
}

function flatten<T>(elems: T[]): T[] {
  return [].concat.apply([], elems);
}

export function combinations<T>(k: number, elems: T[]): T[][] {
  if ( k <= 0 ) { return [ [] ]; }

  // Get all tails
  return (tails(elems)).reduce((acc, tailOfElems) => {
    // For each tail ...
    if (tailOfElems.length === 0) { return acc; }

    // Recursion : get all combinations of (k-1) elements with end elements
    const tailCombinations = combinations (k - 1, tailOfElems.slice(1) );

    // Prepend first element to all combinations
    const comb = tailCombinations.map ((tailCombination) => {
      tailCombination.unshift(tailOfElems[0]);
      return tailCombination;
    });

    // Add to result
    return acc.concat(comb);
  }, [] as T[][]);
}

export function cartesianProduct<T>(...sets: T[][]): T[][] {
  return sets.reduce((acc, set) => {
    return flatten(acc.map((x) => {
      return set.map((y) => {
        return [ ...x, y ];
      });
    }));
  }, [[]]);
}
