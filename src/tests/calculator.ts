// Develop a simple calculator that handles addition and substraction, for example "10 + 42 - 13", with test
// Integrate that calculator in a simple interactive React app
// Move the calculator to a server using for example a simple HTTP POST request
// Add multiplication with operator precedence (optional if time left)

// "10+20-10" -> 20

type Token = number | '+' | '-';

const operators: ('+' | '-')[] = ['+', '-'];

export function tokenize(str: string): Token[] {
  const tokens: Token[] = [];
  let buffer: string | null = null;
  let idx = 0;
  while (idx < str.length) {
    const char = str[idx];
    const charIsNumber = !Number.isNaN(parseInt(char, 10));
    if (buffer === null) {
      if (charIsNumber || operators.includes(char as '+' | '-')) {
        buffer = char;
      } else {
        throw new Error(`Syntax error, invalid characters ${char}`);
      }
    } else {
      switch (char) {
        case '-':
        case '+':
          // @ts-ignore
          if (operators.includes(buffer)) {
            throw new Error('Error, repeated operator');
          } else {
            tokens.push(buffer as Token);
            buffer = char;
          }
          break;
        default:
          if (charIsNumber) {
            /* eslint-disable */
            // @ts-ignore
            if (!operators.includes(buffer)) {
              /* eslint-enable */
              buffer += char;
            } else {
              tokens.push(buffer as Token);
              buffer = char;
            }
          } else {
            tokens.push(buffer as Token);
          }
          break;
      }
    }
    idx++;
  }
  if (buffer !== null) {
    tokens.push(buffer as Token);
  }
  return tokens;
}

export function calculate(
  str: string,
):
  | { success: true; result: number }
  | { success: false; errorMessage: string } {
  try {
    const tokens = tokenize(str);
    let accumulator = null;
    let currentOperator: Token | null = null;
    for (const token of tokens) {
      if (accumulator === null) {
        accumulator = parseInt(token as string, 10);
      } else if (currentOperator === null) {
        currentOperator = token;
      } else if (currentOperator === '+') {
        accumulator += parseInt(token as string, 10) as number;
        currentOperator = null;
      } else if (currentOperator === '-') {
        accumulator -= parseInt(token as string, 10) as number;
        currentOperator = null;
      }
    }
    return {
      success: true,
      result: accumulator as number,
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: e.message,
    };
  }
}
