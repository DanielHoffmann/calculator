/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express = require('express');
import bodyParser = require('body-parser');
import calculator = require('./calculator/calculator');

const app = express();
app.use(bodyParser.json());

app.get<
  never,
  ReturnType<typeof calculator.calculate>,
  never,
  { expression: string }
>('/', (req, res) => {
  res.setHeader('cache-control', 'public, max-age:60000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = calculator.calculate(req.query.expression);
  if (result.success === false) {
    res.status(400);
  }
  res.json(result);
});

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
