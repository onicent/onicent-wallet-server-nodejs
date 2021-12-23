const config = require("../web.config.json");
const jwt = require("jsonwebtoken");

const verify = (role) => {
    return async function (req, res, next) {

        // Get token from header 
        let token = req.headers["x-access-token"];
        // if token is not exist then allow move to the redirect
        if (!token)  return next();        
        // If token exist then checking token Invalid
        jwt.verify(token, config.token.secret, (err, decoded) => {
            // If error then allow move to the redirect
            if (err) return next();             
            // After checking 
            return res.status(403).send({ message: "User are signin!" });
        });            

    };
};


module.exports = verify;

