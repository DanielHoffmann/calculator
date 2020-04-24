import React, { useEffect, useState } from 'react';
import { calculate } from './tests/calculator';

export default { title: 'Test' };

const ExpressionEvaluator = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    async function doIt() {
      const httpResponse = await fetch(
        `http://localhost:3000/?expression=${encodeURIComponent(expression)}`,
      );
      const requestResult: ReturnType<typeof calculate> = await httpResponse.json();
      if (requestResult.success) {
        setResult(String(requestResult.result));
      } else {
        setResult(requestResult.errorMessage);
      }
    }
    doIt();
  }, [expression]);

  return (
    <div>
      <input
        onChange={event => {
          setExpression(event.currentTarget.value);
        }}
      />
      <p>{result}</p>
    </div>
  );
};

export const Test = () => {
  return <ExpressionEvaluator />;
};
