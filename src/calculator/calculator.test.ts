import { calculate, tokenize } from './calculator';

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

describe('errors', () => {
  function assertError(
    response: ReturnType<typeof calculate>,
    partialMessage: string,
  ) {
    expect(response.success).toBe(false);

    expect(
      (response as { errorMessage: string }).errorMessage.toLowerCase(),
    ).toMatch(partialMessage.toLowerCase());
  }

  it('invalid char', () => {
    assertError(calculate('1+a+2'), 'invalid character');
  });

  it('invalid start', () => {
    assertError(calculate('*1+2'), 'can not start with *');
  });

  it('followed operators', () => {
    assertError(calculate('1 + + 2'), 'operator followed by an operator');
  });

  it('followed operators', () => {
    assertError(calculate('1 ++ 2'), 'invalid operator: ++');
  });
});

describe('lower precedence operators tests', () => {
  it('single operation', () => {
    expect(calculate('1+2')).toEqual({
      success: true,
      result: 3,
    });
  });

  it('single digit', () => {
    expect(calculate('1+2+3-4+6')).toEqual({
      success: true,
      result: 8,
    });
  });

  it('multiple digit test', () => {
    expect(calculate('22+3+56')).toEqual({
      success: true,
      result: 81,
    });
  });
});

describe('high precedence operators tests', () => {
  it('single operation', () => {
    expect(calculate('1*2')).toEqual({
      success: true,
      result: 2,
    });
  });

  it('single digit', () => {
    expect(calculate('1*2*3')).toEqual({
      success: true,
      result: 6,
    });
  });

  it('multiple digit test', () => {
    expect(calculate('10*3*10*2*1')).toEqual({
      success: true,
      result: 600,
    });
  });
});

describe('complex and edge cases', () => {
  it('mixed precedence operators1', () => {
    expect(calculate('1*2+3+5*2*10+48+30*50')).toEqual({
      success: true,
      result: 1653,
    });
  });

  it('mixed precedence operators2', () => {
    expect(calculate('1*2+3-5*2*10-48-30*50')).toEqual({
      success: true,
      result: -1643,
    });
  });

  it('start with - and spaces', () => {
    expect(calculate('- 1 *   3+   5-4')).toEqual({
      success: true,
      result: -2,
    });
  });

  it('start with + and spaces', () => {
    expect(calculate('+ 1 *   3+   5-4')).toEqual({
      success: true,
      result: 4,
    });
  });
});
