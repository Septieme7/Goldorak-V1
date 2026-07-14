// backend/middlewares/dbMiddleware.js
export function dbMiddleware(db) {
    return (req, res, next) => {
        req.db = db;
        next();
    };
}