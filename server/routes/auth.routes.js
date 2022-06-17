const {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  SALT_ROUND,
} = require('../constants/auth');

const Router = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {check, validationResult} =require('express-validator')

const router = new Router();

router.post('/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password',
      `Password should be longer than ${MIN_PASSWORD_LENGTH} and shorter than ${MAX_PASSWORD_LENGTH}`)
      .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH }),
  ],
  async (req, res) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: `Uncorrect result`, errors});
    }

    const { email, password } = req.body;
    const foundUser = await User.findOne({ email: email });
    if(foundUser) {
      return res.status(400).json({ message: `User with email ${email} is already exist` })
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUND);
    const user = new User({ email, password: hashPassword });
    await user.save();

    return res.json({ message: `User was created` });
    
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
});

module.exports = router;
