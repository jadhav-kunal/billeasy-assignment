const express = require('express');
const app = express();

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

app.use(express.json());

app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server Started - Listening on port ' + PORT);
});
