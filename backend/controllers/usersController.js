const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await userModel.create(req.body.username, hashedPassword, req.body.email);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findByUsername(username);
        console.log(user);
        console.log({ submittedPassword: password, storedHash: user.PASSWORD_HASH });
        if (user && await bcrypt.compare(password, user.PASSWORD_HASH)) {
            const token = jwt.sign(
                { user_id: user.USER_ID, username: user.USERNAME },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.cookie('token', token, {
                httpOnly: true, // JavaScript access not allowed
                secure: true, // Only transmit cookies over HTTPS
                sameSite: 'strict', // Mitigate CSRF attack
                maxAge: 24 * 60 * 60 * 1000 // Cookie expiration: 24 hours
            });
            res.json({ message: "Login successful", token })
        } else {
            res.status(401).send("Login failed: Username or password is incorrect");
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send("An error occurred during the login process");
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
};

