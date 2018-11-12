const jwt = require('jsonwebtoken');


// =====================
// Verificar Token
// =====================
let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token is not valid'
                }
            });
        }

        req.user = decoded.user;
        next();

    });



};

// =====================
// Verifica AdminRole
// =====================
let verifyCompany_Role = (req, res, next) => {

    let user = req.user;

    if (user.role === 'COMPANY') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'User have not the privileges to do this.'
            }
        });
    }
};



module.exports = {
    verifyToken,
    verifyCompany_Role
}