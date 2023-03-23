import dotenv from "dotenv";
dotenv.config();
import verifyToken from './verifyToken.js';

// verify if a staff is type Manager
const verifyManager = async (req, res, next) => {
    try {
        verifyToken(req, res, () => {
        if (req.user.isManager === false || req.user.isManager == null ) {
            return res.status(403).json( {message: "Not an Authorised Staff"} );
        } else {
            next();
        }
    });
    } catch (err) {
        console.error(err.message);
        return res.status(403).json( {message: "Not Authorised"} );
    }
};

export default verifyManager