// tslint:disable:no-unused-expression
import { expect } from 'chai';
import 'mocha';
import * as utils from 'src/utils';

describe('utils', () => {

  describe('removeFirst', () => {

    it('should remove the first occurrence', () => {
      const arr = [1, 2, 3];
      const removed = utils.removeFirst(arr, 2);
      expect(removed).to.deep.equal([1, 3]);
    });

    it('should not remove other occurrences', () => {
      const arr = [1, 2, 2, 2, 3];
      const removed = utils.removeFirst(arr, 2);
      expect(removed).to.deep.equal([1, 2, 2, 3]);
    });

    it('should not modify the original array', () => {
      const arr = [1, 2, 3];
      utils.removeFirst(arr, 2);
      expect(arr).to.deep.equal([1, 2, 3]);
    });

    it('should do nothing if the array does not contain the element', () => {
      const arr = [1, 2, 3];
      const removed = utils.removeFirst(arr, 4);
      expect(arr).to.deep.equal([1, 2, 3]);
      expect(removed).to.deep.equal([1, 2, 3]);
      expect(arr).to.not.equal(removed);
    });

  });

});
