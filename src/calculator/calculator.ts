// Develop a simple calculator that handles addition and substraction, for example "10 + 42 - 13", with test
// Integrate that calculator in a simple interactive React app
// Move the calculator to a server using for example a simple HTTP POST request
// Add multiplication with operator precedence (optional if time left)

// "10+20-10" -> 20

import { isNumber } from './isNumber';
import { Operator, Token, operators } from './types';

function getCharType(char: string): 'space' | 'number' | 'operator' {
  if (char === ' ') {
    return 'space';
  } else if (operators.includes(char as Operator)) {
    return 'operator';
  } else if (isNumber(char)) {
    return 'number';
  }
  throw new Error(`Syntax Error, Invalid character: ${char}`);
}

export function tokenize(str: string): Token[] {
  const tokens: Token[] = [];

  type State = 'number' | 'operator' | 'space';
  let currentState: State = 'space'; // the space can work as an initial state
  let stack = '';
  function setState(newState: State) {
    currentState = newState;
    if (stack === '') {
      return;
    }
    if (isNumber(stack)) {
      tokens.push(parseInt(stack, 10));
    } else {
      if (!operators.includes(stack as Operator)) {
        throw new Error(`invalid operator: ${stack}`);
      }
      tokens.push(stack as Operator);
    }
    stack = '';
  }

  // see the tokenizer.png in the root of the project for how the state machine works
  let idx = 0;
  while (idx < str.length) {
    const char = str[idx];
    const charType = getCharType(char);
    switch (currentState as State) {
      case 'space': // space and initial have the same behavior
        switch (charType) {
          case 'number':
            setState('number');
            break;
          case 'operator':
            setState('operator');
            break;
          case 'space':
            idx++;
            break;
        }
        break;
      case 'number':
        switch (charType) {
          case 'number':
            stack += char;
            idx++;
            break;
          case 'operator':
            setState('operator');
            break;
          case 'space':
            setState('space');
            break;
        }
        break;
      case 'operator':
        switch (charType) {
          case 'number':
            setState('number');
            break;
          case 'operator':
            stack += char;
            idx++;
            break;
          case 'space':
            setState('space');
            break;
        }
        break;
    }
  }
  // final state
  if (stack.trim() === '') {
    // only spaces at the end
    return tokens;
  } else if (isNumber(stack)) {
    tokens.push(parseInt(stack, 10));
    return tokens;
  }
  throw new Error(
    `Syntax Error: Expression can not finish with an operator, operator: ${stack}`,
  );
}

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
    tokens = tokenize(str);
  } catch (e) {
    return {
      success: false,
      errorMessage: e.message,
    };
  }

  // handles when the string starts with an operator
  if (!isNumber(tokens[0])) {
    if (tokens[0] === '+') {
      tokens = tokens.slice(1);
    } else if (tokens[0] === '-') {
      tokens = [-tokens[1], ...tokens.slice(2)];
    } else {
      return {
        success: false,
        errorMessage: `expression can not start with ${tokens[0]}`,
      };
    }
  }

  // converting token list to postfix notation
  // using https://en.wikipedia.org/wiki/Shunting-yard_algorithm
  let tokenIdx = 0;
  const tokensPostfix: Token[] = [];
  const operatorStack: Operator[] = [];
  const precedence: { [key in Operator]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
  };

  let previousTokenType: ReturnType<typeof getTokenType> | null = null;
  while (tokenIdx < tokens.length) {
    const token = tokens[tokenIdx];
    const tokenType = getTokenType(token);
    if (previousTokenType === 'operator' && tokenType === 'operator') {
      return {
        success: false,
        errorMessage:
          'Semantic error: can not have an operator followed by an operator',
      };
    }

    if (previousTokenType === 'number' && tokenType === 'number') {
      return {
        success: false,
        errorMessage:
          'Semantic error: can not have an number followed by an number',
      };
    }

    previousTokenType = tokenType;

    if (tokenType === 'number') {
      tokensPostfix.push(token);
    }
    if (tokenType === 'operator') {
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1]] >=
          precedence[token as Operator]
      ) {
        // operator at the top of the operator stack with greater precedence
        // moving it to the tokensPostfix
        tokensPostfix.push(operatorStack.pop() as Operator);
      }
      operatorStack.push(token as Operator);
    }
    tokenIdx++;
  }
  // pushing the remaining operators
  while (operatorStack.length > 0) {
    tokensPostfix.push(operatorStack.pop() as Operator);
  }
  // console.log(str);

  // reducing the postfix token list until we get a single value
  while (tokensPostfix.length > 1) {
    // console.log(tokensPostfix);
    let tokenIdx = 0; // eslint-disable-line
    // iterating until we find an operator
    while (tokenIdx < tokensPostfix.length) {
      tokenIdx++;
      if (getTokenType(tokensPostfix[tokenIdx]) === 'operator') {
        break;
      }
    }
    // processing operator
    let result: number;
    const v1: number = tokensPostfix[tokenIdx - 2] as number;
    const v2: number = tokensPostfix[tokenIdx - 1] as number;
    switch (tokensPostfix[tokenIdx] as Operator) {
      case '+':
        result = v1 + v2;
        break;
      case '-':
        result = v1 - v2;
        break;
      case '*':
        result = v1 * v2;
        break;
    }
    // removes indexes "tokenIdx", "tokenIdx-1" and tokenIdx-2, adds result in their place
    tokensPostfix.splice(tokenIdx - 2, 3, result);
  }

  return {
    success: true,
    result: tokensPostfix[0] as number,
  };
}
