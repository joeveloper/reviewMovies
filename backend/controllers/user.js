const nodemailer = require('nodemailer')
const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');


exports.create = async (req, res) => {
  const {name, email, password} = req.body;


  //created as a base to check for existing user email
  const oldUser = await User.find({email});

  //execute if user email already exists
  if (oldUser) {
    res.status(401).json({error: 'email is already in use'});
  }

  //proceed to create and save new user
  const newUser =  new User({name, email, password});

  await newUser.save()

  //generate 6 digit otp
  let OTP = ''; 
  for (let i = 0; i <= 5; i++) {
   const randomVal = Math.round(Math.random() * 9);
   OTP += randomVal;
  }

  //store OT inside db
  const newEmailVerificationToken = new EmailVerificationToken(
    {owner: newUser._id, token: OTP});

    //save verification token
   await newEmailVerificationToken.save();

   //send OTP to our user using mailtrap via nodemailer
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b68f6f464d60c6",
      pass: "5ae5a003b5edfb"
    }
  });

  //send OTP using email to new user
  transport.sendMail({
    from: 'verification@reviewmovies.com',
    to: newUser.email,
    subject: 'Email Verification',
    html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `    
  });

  console.log(OTP)

  res.json({
    message: 'Please verify your email. OTP has been sent to your email!'});
};

