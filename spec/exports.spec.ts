// tslint:disable:no-unused-expression
import * as ArkhamOdds from "arkham-odds";
import { expect } from "chai";
import "mocha";

describe("exports", () => {
  it("exports the `odds` function", () => {
    expect(ArkhamOdds.odds).to.exist;
  });
});
