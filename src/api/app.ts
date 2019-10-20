import express, { Request, Response } from 'express';
import logger from '../classes/Logger';
import actionsRouter from './routes/actions';
import usersRouter from './routes/users';
import guildUsersRouter from './routes/users/guild';

const app = express();
const port = process.env.PORT || 5000;

app.use('/actions', actionsRouter);
app.use('/users', [usersRouter, guildUsersRouter]);
app.get('/', (_, res: Response) => {
  res.status(200).send('Hello');
});

app.listen(port, () => {
  logger.info(`Server listening at ${port}`);
});
