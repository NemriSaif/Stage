const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserModel = require('./models/user');
const saltRounds = 10;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/users');
app.post('/', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.json("success");
                } else {
                    res.json("incorrect password");
                }
            });
        } else {
            res.json("user not found");
        }
    })
    .catch(err => res.status(500).json(err));
})
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = { ...req.body, password: hashedPassword };
        UserModel.create(newUser)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
    } catch (err) {
        res.status(500).json(err);
    }
});
app.listen(3001, () => console.log('Server is running on port 3001'));