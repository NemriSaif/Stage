const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserModel = require('./models/user');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET="qsdfazerty"

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/users');


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({ email: email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    // Create a token with just email and userID
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userID: user._id
                        },
                        JWT_SECRET
                    );

                    res.status(200).json({ status: "success", token: token });
                } else {
                    res.status(400).json({ error: "Mot de passe incorrect" });
                }
            });
        } else {
            res.status(400).json({ error: "Aucun compte avec cet e-mail n'existe" });
        }
    })
    .catch(err => res.status(500).json({ error: "Erreur serveur" }));
});
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