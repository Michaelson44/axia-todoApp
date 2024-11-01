const userModel = require("../model/user");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({success: true, message: users});
    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
}

const getSingleUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userModel.findById(id);
        res.status(200).json({success: true, user});
    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
}

const updateUser = async (req, res) => {
    // get things we dont want user to update
    const {password, ...others} = req.body;
    const {id} = req.user;
    try {
        const updated = await userModel.findByIdAndUpdate(id, {...others}, {new: true});
        if (!updated) {
            return res.status(321).json({success: false, error: "something went wrong"});
        }
        res.status(200).json({message: "user info updated"});
    } catch (err) {
        res.status(500).json(err.message);
    }
};

const updatePassword = async (req, res) => {
    // get old password from body
    const {oldpassword, newpassword} = req.body;
    const {id} = req.user;
    try {
        const user = await userModel.findById(id);
        // check if old password matches
        const verify = bcrypt.compareSync(oldpassword, user.password);
        if (!verify) {
            return res.status(401).json({error: "invalid credential"});
        }
        // then we update if it matches
        await userModel.findByIdAndUpdate(id, {password: newpassword}, {new: true});
        res.status(201).json({message: "password has been updated"});
    } catch (err) {
        res.status(500).json(err.message);
    }
};

const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        await userModel.findByIdAndDelete(id);
        res.clearCookie("token")
            .status(200).json({success: true, message: "user has been deleted"});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
}

module.exports = {updateUser, updatePassword, deleteUser, getUsers, getSingleUser};