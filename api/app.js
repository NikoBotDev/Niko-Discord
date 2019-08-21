const express = require('express');
const logger = require('../classes/Logger');
const actionsRouter = require('./routes/actions');

const app = express();
const port = process.env.PORT || 5000;

app.use(actionsRouter);

app.get('/', (_, res) => {
  res.status(200).send('Hello');
});

app.listen(port, () => {
  logger.info(`Server listening at ${port}`);
});
