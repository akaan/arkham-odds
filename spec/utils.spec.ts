// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import * as utils from "utils";

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
});
