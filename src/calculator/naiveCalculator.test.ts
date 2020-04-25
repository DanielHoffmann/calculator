import { calculate, tokenize } from './naiveCalculator';

describe('tokenizer tests', () => {
  it('single operation', () => {
    expect(tokenize('1+2')).toEqual([1, '+', 2]);
  });
  it('single digit', () => {
    expect(tokenize('1+2+3-4+6')).toEqual([1, '+', 2, '+', 3, '-', 4, '+', 6]);
  });
  it('multiple digit test', () => {
    expect(tokenize('22+3+56')).toEqual([22, '+', 3, '+', 56]);
  });
  it('long expression', () => {
    expect(tokenize('1*2+3-5*2*10-48-30*50')).toEqual([
      1,
      '*',
      2,
      '+',
      3,
      '-',
      5,
      '*',
      2,
      '*',
      10,
      '-',
      48,
      '-',
      30,
      '*',
      50,
    ]);
  });

  it('start with - and spaces', () => {
    expect(tokenize('- 1 *   3+   5-4  ')).toEqual([
      '-',
      1,
      '*',
      3,
      '+',
      5,
      '-',
      4,
    ]);
  });
});

describe('calculate tests', () => {
  it('single operation', () => {
    expect(calculate('1*2')).toEqual({
      success: true,
      result: 2,
    });
  });
  it('start with + and spaces', () => {
    expect(calculate('+ 1 *   3+   5-4')).toEqual({
      success: true,
      result: 4,
    });
  });
});
