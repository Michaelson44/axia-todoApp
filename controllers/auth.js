const bcrypt = require('bcryptjs');
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    // get the password and spread others
    const {password, ...others} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new userModel({...others, password: hashedPassword});
    try {
        const saved = await newUser.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

const login = async (req, res) => {
    // get the email and password
    const {email, password} = req.body;
    // check if user exist 
    const user = await userModel.findOne({email});
    if (!user) {
        return res.status(402).json("user does not exist")
    }
    // check if password is correct 
    const verify = bcrypt.compareSync(password, user.password);
    if (!verify) {
        return res.status(404).json("password does not match");
    }
    // now we set user cookie if they pass preceeding conditions
    const about = {id: user.id, name: user.username, isAdmin: user.isAdmin};
    const token = jwt.sign(about, process.env.secret);
    res.cookie("token", token)
        .status(200)
        .json({message: "user logged in"});
};

const oAuth = async (req, res) => {
    const {username, email, gender} = req.body;
    try {
        const user = await userModel.findOne({email});
        // checking to see if user credentials exist
        if (user && user.credentialsAccount) {
            return res.status(402)
                        .json({error: "invalid credentials"})
        }
        // then login existing oauth
        if (user) {
            const about = {id: user.id, gender: user.gender};
            const token = jwt.sign(about, process.env.secret);
            return res.cookie("token", token)
                        .status(200)
                        .json({message: "user has been logged in"});
        }
        // register new user
        const newUser = new userModel(
                    {username, email, gender, credentialsAccount: false});
        const savedUser = await newUser.save();
        const about = {id: savedUser.id, gender: savedUser.gender};
        const token = jwt.sign(about, process.env.secret);
        res.cookie("token", token)
            .status(200)
            .json({message: "user has been created"});
    } catch (error) {
        res.status(401).json(error.message);
    }
};

const logOut = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({message: "user has been logged out"})
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {register, login, oAuth, logOut};