
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";


const fetchuser = async (req, res, next) => {

    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        console.log(token);
        //decode the token
        const deocded_data = jwt.verify(token, JWT_SECRET);
        console.log(deocded_data);
        req.id=deocded_data.id;
        // req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchuser;