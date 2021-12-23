const Users = require('../models/account.model');
const Role = require('../models/role.model');
const config = require("../web.config.json");
const jwt = require("jsonwebtoken");

const auth = (role) => {
    return async function (req, res, next) {

        // verify Token
        // Get token from header 
        let token = req.headers["x-access-token"];
        // if token is not exist then show error
        if (!token)  return res.status(403).send({ message: "No token provided!" });        
        // If token exist then checking token Invalid
        jwt.verify(token, config.token.secret, (err, decoded) => {
            // If error then show error
            if (err) return res.status(401).send({ message: "Unauthorized!" }); 

            if(role === undefined || role.length === 0|| role === null){
                return next();
            }else{
                req.userId = decoded.id;
                // After checking token then find user role to authentication url
                Users.findById(req.userId).exec((err, user) => {
                    if (user === null) return res.status(500).send({ message: 'err' });
        
                    // If error
                    if (err) return res.status(500).send({ message: err });
                    // Find role user
                    Role.find( {  _id: { $in: user.roles } }, (err, roles) => {
                        if (err) return res.status(500).send({ message: err });     
                        //Checking all have rolein user.
                        for (let i = 0; i < roles.length; i++) {
                            for (let i = 0; i < role.length; i++) {
                                if (roles[i].name === role[i]) {
                                    next(req.userId);
                                    return;
                                }
                            }                            
                        }
                
                        res.status(403).send({ message: "Not have access!" });
                        return;
                    });
                });
            }

            

        });        
       

    };
};


module.exports = auth;

