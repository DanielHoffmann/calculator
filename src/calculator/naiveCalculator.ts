import { tokenize as originalTokenizer } from './calculator';
import { isNumber } from './isNumber';
import { Token } from './types';

export const tokenize = originalTokenizer;

function getTokenType(token: Token): 'number' | 'operator' {
  if (isNumber(token)) {
    return 'number';
  }
  return 'operator';
}

export function calculate(
  str: string,
):
  | { success: true; result: number }
  | { success: false; errorMessage: string } {
  let tokens: Token[];
  try {
    tokens = originalTokenizer(str);
    // handling when expression starts with '+' or '-'
    if (tokens[0] === '+') {
      tokens = tokens.slice(1);
    } else if (tokens[0] === '-') {
      if (typeof tokens[1] !== 'number') {
        throw new Error(
          `Semantic error: Can't have a number followed by another number or an operator followed by another operator, token1: ${tokens[0]}, token2: ${tokens[1]}`,
        );
      }
      tokens[1] = tokens[1] * -1;
      tokens = tokens.slice(1);
    }
  } catch (e) {
    return {
      success: false,
      errorMessage: e.message,
    };
  }
  const lowerPrecedenceTokens: Token[] = [];
  let secondToLastToken: Token | null = null;
  let lastToken: Token | null = null;
  // handling higher precedence operators
  for (const token of tokens) {
    if (lastToken !== null && getTokenType(token) === getTokenType(lastToken)) {
      return {
        success: false,
        errorMessage: `Semantic error: Can't have a number followed by another number or an operator followed by another operator, token1: ${lastToken}, token2: ${token}`,
      };
    }
    if (secondToLastToken !== null && lastToken === '*') {
      switch (lastToken) {
        case '*':
          const newToken: Token =
            (secondToLastToken as number) * (token as number);
          secondToLastToken = null;
          lastToken = newToken;
          break;
      }
      // eslint-disable-next-line
    } else {
      if (secondToLastToken !== null) {
        lowerPrecedenceTokens.push(secondToLastToken);
      }
      secondToLastToken = lastToken;
      lastToken = token;
    }
  }
  if (secondToLastToken !== null) {
    lowerPrecedenceTokens.push(secondToLastToken as Token);
  }
  if (lastToken !== null) {
    lowerPrecedenceTokens.push(lastToken as Token);
  }

  // handling lower precedence operators
  secondToLastToken = null;
  lastToken = null; // the expression will be "reduced" into lastToken
  // meaning it will have the final result
  for (const token of lowerPrecedenceTokens) {
    if (secondToLastToken !== null && lastToken !== null) {
      switch (lastToken) {
        case '+':
          lastToken = (secondToLastToken as number) + (token as number);
          break;
        case '-':
          lastToken = (secondToLastToken as number) - (token as number);
          break;
      }
      secondToLastToken = null;
    } else {
      secondToLastToken = lastToken;
      lastToken = token;
    }
  }

  return {
    success: true,
    result: lastToken as number,
  };
}
