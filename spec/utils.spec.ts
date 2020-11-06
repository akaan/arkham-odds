// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import * as utils from "../src/utils";

describe("utils", () => {
  describe("removeFirst", () => {
    it("should remove the first occurrence", () => {
      const arr = [1, 2, 3];
      const removed = utils.removeFirst(arr, 2);
      expect(removed).to.deep.equal([1, 3]);
    });

    it("should not remove other occurrences", () => {
      const arr = [1, 2, 2, 2, 3];
      const removed = utils.removeFirst(arr, 2);
      expect(removed).to.deep.equal([1, 2, 2, 3]);
    });

    it("should not modify the original array", () => {
      const arr = [1, 2, 3];
      utils.removeFirst(arr, 2);
      expect(arr).to.deep.equal([1, 2, 3]);
    });

    it("should do nothing if the array does not contain the element", () => {
      const arr = [1, 2, 3];
      const removed = utils.removeFirst(arr, 4);
      expect(arr).to.deep.equal([1, 2, 3]);
      expect(removed).to.deep.equal([1, 2, 3]);
      expect(arr).to.not.equal(removed);
    });
  });

  describe("replace", () => {
    it("should replace at specified index", () => {
      const arr = ["a", "b", "c"];
      const replaced = utils.replace(arr, 1, "x");
      expect(replaced).to.deep.equal(["a", "x", "c"]);
    });

    it("should be able to replace at first position", () => {
      const arr = ["a", "b", "c"];
      const replaced = utils.replace(arr, 0, "x");
      expect(replaced).to.deep.equal(["x", "b", "c"]);
    });

    it("should be able to replace at last position", () => {
      const arr = ["a", "b", "c"];
      const replaced = utils.replace(arr, 2, "x");
      expect(replaced).to.deep.equal(["a", "b", "x"]);
    });

    it("should return the same array if specified index is < 0", () => {
      const arr = ["a", "b", "c"];
      const replaced = utils.replace(arr, -1, "x");
      expect(replaced).to.deep.equal(["a", "b", "c"]);
    });

    it("should return the same array if specified index is > array length", () => {
      const arr = ["a", "b", "c"];
      const replaced = utils.replace(arr, 3, "x");
      expect(replaced).to.deep.equal(["a", "b", "c"]);
    });
  });

  describe("flatten", () => {
    it("flattens an array", () => {
      expect(utils.flatten([[], [1], [2]])).to.deep.equal([1, 2]);
    });
  });

  describe("arrayEquals", () => {
    it("returns true if the arrays contain the same values in the same order", () => {
      expect(utils.arrayEquals([1, 2, 3], [1, 2, 3])).to.be.true;
    });

    it("returns false if the arrays do not contain the same values", () => {
      expect(utils.arrayEquals([1, 2, 3], [1, 2, 4])).to.be.false;
    });

    it("returns false if the arrays contain the same values but in a different order", () => {
      expect(utils.arrayEquals([1, 2, 3], [3, 1, 2])).to.be.false;
    });

    it("can compare different primitives", () => {
      expect(utils.arrayEquals(["a", "b"], ["a", "b"])).to.be.true;
      expect(utils.arrayEquals([1.0, 2.5], [1.0, 2.5])).to.be.true;
      expect(utils.arrayEquals([true, false], [true, false])).to.be.true;
      expect(utils.arrayEquals([1, null, undefined], [1, null, undefined])).to
        .be.true;
    });
  });

  describe("combinations", () => {
    it("should return an empty array if K > N", () => {
      const arr = [1, 2, 3];
      const comb = utils.combinations<number>(4, arr);
      expect(comb).to.deep.equals([]);
    });

    it("should return [[]] if K <= 0", () => {
      const arr = [1, 2, 3];
      expect(utils.combinations(0, arr)).to.deep.equals([[]]);
      expect(utils.combinations(-5, arr)).to.deep.equals([[]]);
    });

    it("should return the combinations", () => {
      const arr = [1, 2, 3];
      const expected = [
        [1, 2],
        [1, 3],
        [2, 3]
      ];
      expect(utils.combinations(2, arr)).to.deep.equals(expected);
    });
  });

  describe("allCombinations", () => {
    it("should return [[]] if provided an empty array of elements", () => {
      const allComb = utils.allCombinations<number>([]);
      expect(allComb).to.deep.equals([[]]);
    });

    it("should return all combinations of provided elements including empty and full sets", () => {
      const arr = [1, 2, 3];
      const expected = [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]];
      const allComb = utils.allCombinations<number>(arr);
      expect(allComb).to.deep.equals(expected);
    });
  });

  describe("cartesianProduct", () => {
    it("should compute cartesian product of 2 arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const expected = [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4]
      ];
      expect(utils.cartesianProduct(arr1, arr2)).to.deep.equals(expected);
    });
  });

  describe("factorial", () => {
    it("returns 1 for 0!", () => {
      expect(utils.factorial(0)).to.equal(1);
    });

    it("returns 6 for 3!", () => {
      expect(utils.factorial(3)).to.equal(6);
    });
  });
});
