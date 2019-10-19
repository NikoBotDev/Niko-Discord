const express = require('express');
const logger = require('../classes/Logger');
const actionsRouter = require('./routes/actions');
const usersRouter = require('./routes/users');
const guildUsersRouter = require('./routes/users/guild');

const app = express();
const port = process.env.PORT || 5000;

app.use('/actions', actionsRouter);
app.use('/users', [usersRouter, guildUsersRouter]);
app.get('/', (_, res) => {
  res.status(200).send('Hello');
});

app.listen(port, () => {
  logger.info(`Server listening at ${port}`);
});
