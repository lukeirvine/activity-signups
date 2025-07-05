import { verifyPeriodInput } from "@/helpers/utils"

describe('period input validation', () => {
  it('returns true for "0,1"', () => {
    expect(verifyPeriodInput("0,1")).toEqual(true);
  });

  it('returns false for "0-1"', () => {
    expect(verifyPeriodInput("0-1")).toEqual(false);
  });

  it('returns true for "5, 6"', () => {
    expect(verifyPeriodInput("5, 6")).toEqual(true);
  });

  it('returns false for "6,7"', () => {
    expect(verifyPeriodInput("6,7")).toEqual(false);
  });

  it('returns true for "1,2,3"', () => {
    expect(verifyPeriodInput("1,2,3")).toEqual(true);
  });
  
  it('returns false for "1,2,4"', () => {
    expect(verifyPeriodInput("1,2,4")).toEqual(false);
  });
});