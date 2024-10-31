const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(400).json({error: "you are not authenticated"});
    }
    jwt.verify(token, process.env.secret, (err, info) => {
        if (err) {
            return res.status(400).json(err.message);
        }
        req.user = info;
        next();
    })
};

const verifyAndAuth = (req, res, next) => {
    verify(req, res, () => {
        if (req.user.id === req.params.id) {
            return res.status(401).json({success: false, error: "you are not allowed to do that"})
        }
        next()
    });
}

const verifyTask = (req, res, next) => {
    verify(req, res, () => {
        const {completed} = req.body;
        if (!completed) {
            return res.status(301).json({success: true, message: "task has not been completed"});
        }
        next();
    })
}

const verifyAdmin = (req, res, next) => {
    verify(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(401).json({success: false, error: "you are not authorised for that"});
        }
    })
}

module.exports = {verify, verifyAndAuth, verifyTask, verifyAdmin } ;