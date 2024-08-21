const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/user');
const { send2FACode } = require('./models/mailer');

const app = express();
const saltRounds = 10;
const JWT_SECRET = 'qsdfazerty';

app.use(express.json());
app.use(cors());

// Serve static files (e.g., profile pictures) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                if (user.is2FAEnabled) {
                    // Generate and send 2FA code
                    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
                    user.twoFactorAuthToken = code;
                    user.twoFactorAuthTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
                    await user.save();
                    await send2FACode(email, code);
                    res.status(200).json({ status: "2FA required" });
                } else {
                    const token = jwt.sign(
                        { email: user.email, userID: user._id },
                        JWT_SECRET
                    );
                    res.status(200).json({ status: "success", token });
                }
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

// 2FA verification endpoint
app.post('/verify-2fa', async (req, res) => {
    const { email, twoFactorAuthToken } = req.body;
  
    try {
        const user = await UserModel.findOne({ email });
        if (user && user.twoFactorAuthToken === twoFactorAuthToken && user.twoFactorAuthTokenExpiry > new Date()) {
            const token = jwt.sign(
                { email: user.email, userID: user._id },
                JWT_SECRET
            );
            user.twoFactorAuthToken = null; // Clear the 2FA token after verification
            user.twoFactorAuthTokenExpiry = null;
            await user.save();
            res.status(200).json({ status: "success", token });
        } else {
            res.status(400).json({ error: "Invalid or expired 2FA code" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
        const result = await UserModel.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Update profile
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

// Profile picture upload
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
