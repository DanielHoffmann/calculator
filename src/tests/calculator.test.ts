import { calculate, tokenize } from './calculator';

describe('tokenizer tests', () => {
  it('single digit', () => {
    const str = '1+2+3-4+6';
    const tokens = tokenize('1+2+3-4+6');
    expect(tokens).toEqual(['1', '+', '2', '+', '3', '-', '4', '+', '6']);
    expect(calculate(str)).toEqual({
      success: true,
      result: 8,
    });
  });

  it('multiple digit test', () => {
    const str = '22+3+56';
    const tokens = tokenize(str);
    expect(tokens).toEqual(['22', '+', '3', '+', '56']);
    expect(calculate(str)).toEqual({
      success: true,
      result: 81,
    });
  });
});
