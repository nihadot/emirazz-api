import jwt from "jsonwebtoken";

export const verifyToken = ((req, res, next) => {

    const token = req.cookies.accessToken;

    console.log(token)

    if (!token) return res.status(401).json({message:'Your are not authenticated!'}).end();
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        
        if (err) return res.status(403).json({message: err?.message ||"Token is not valid!"}).end();
        req.user = user
        next();
    })
})

// export const verifyAdminOrTrainerRole = (req, res, next) => {

//     verifyToken(req, res, () => {
        
//         if (req.user?.isAdmin || req.user?.isTrainer ) {
//             next()
//         } else {
//             return next(createError(403, "You are not authorized!"));
//         }
//     })

// }


// export const verifyAdminOrStudentRole = (req, res, next) => {

//     verifyToken(req, res, () => {
//         if (req.user?.isAdmin || req.user?.isStudent ) {
//             next()
//         } else {
//             return next(createError(403, "You are not authorized!"));
//         }
//     })

// }


// export const verifyAdminOrStudentorTrainerRole = (req, res, next) => {

//     verifyToken(req, res, () => {
//         if (req.user?.isAdmin || req.user?.isStudent || req.user?.isTrainer ) {
//             next()
//         } else {
//             return next(createError(403, "You are not authorized!"));
//         }
//     })

// }






export const verifyAdmin = (req, res, next) => {

    verifyToken(req, res, () => {        
        if (req.user && req.user.isAdmin) {
            next();
        }else{
            return res.status(403).json({message:'You are not authorized!'}).end();
        }
    })

}