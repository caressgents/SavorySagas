import express from 'express';
import jwt from 'jsonwebtoken';
import User from '/root/gpt-pilot/workspace/SavorySagas.com/models/User.js'; // Adjust the import path as needed

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    let { username, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ _id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).
send('Invalid username or password');
    }

    const token = jwt.sign({ _id: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
