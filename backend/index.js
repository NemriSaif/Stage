const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const UserModel = require('./models/user');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'qsdfazerty';

app.use(express.json());
app.use(cors());

// Serve static files (e.g., profile pictures) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename format
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.get('/users', async (req, res) => {
    try {
      const users = await UserModel.find(); // Fetch all users from the database
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  });
// Update profile endpoint
app.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, saltRounds);
        }

        const user = await UserModel.findByIdAndUpdate(decoded.userID, updates, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
});

// Fetch user profile
app.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.userID);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

// Delete account
app.delete('/delete-account', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        await UserModel.findByIdAndDelete(decoded.userID);
        res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting account" });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userID: user._id
                    },
                    JWT_SECRET
                );
                res.status(200).json({ status: "success", token });
            } else {
                res.status(400).json({ error: "Incorrect password" });
            }
        } else {
            res.status(400).json({ error: "No account found with this email" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// User registration
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = { ...req.body, password: hashedPassword };
        const user = await UserModel.create(newUser);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Change password
app.put('/change-password', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.userID);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

        if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating password' });
    }
});

// Profile picture upload endpoint
app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.userID);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.profilePic = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({ message: "Profile picture updated", profilePic: user.profilePic });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: "Error updating profile picture" });
    }
});

app.listen(3001, () => console.log('Server is running on port 3001'));
