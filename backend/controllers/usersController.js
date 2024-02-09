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
        if (user && await bcrypt.compare(password, user.PASSWORD_HASH)) {
            console.log('Before calling getUserRoles');
            const roles = await userModel.getUserRoles(user.USER_ID);
            console.log('After calling getUserRoles');
            console.log('User:', user.USER_ID);
            console.log('Roles before signing token:', roles);
            const token = jwt.sign(
                { user_id: user.USER_ID, username: user.USERNAME, roles: roles},
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict', 
                maxAge: 24 * 60 * 60 * 1000
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

