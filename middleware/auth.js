import jwt from 'jsonwebtoken';
import model from '../models';
const {User} = model;

module.exports = {
	isAuth: (req,res,next) => {
		try {
			const {token} = req;
			var decoded = jwt.verify(token, process.env.SECRET);
			req.user = decoded;
			next();
		} catch(err) {
			res.status(401).json({
				message: 'Token is Invalid'
			});
		}
	},
};
