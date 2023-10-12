const JWT_SECRET = "4c0d608098b78d61cf5654965dab8b53632bf831dc6b43f29289411376ac107b";
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[0];
    if (!token) {
        // res.redirect("/login")
        return res.status(401).send("Authorization failed. No access token.");
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).send("Could not verify token");
        }
        req.user = user;
    });
    next();
};

module.exports = authenticateToken;