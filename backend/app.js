const express = require('express');
require('./db');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);

//sign-in route with middleware function
app.post('/sign-in', (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.json({error: 'email/password missing'});
  }
  next();
} ,(req, res) => {
  res.send('<h1>This is the about page</h1>')
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log('App is listeing on port 8000')
  });





