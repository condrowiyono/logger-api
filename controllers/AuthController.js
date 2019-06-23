import model from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Response from './Helper/Response';
import { validateEmail, validatePhone } from './Helper/Validator';

const {User} = model;

module.exports = {
	register: (req, res) => {
		const {name,username,email,password,phone_number,position,address} = req.body;

		User.create({
			name,
			username,
			email,
			password,
			phoneNumber: phone_number,
			position,
			address,
		}).then((user) => {
			res.status(201).json(Response.writeResponse(`Success Sign Up New User`,null,user,null));
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(`Error`,null,null,err.errors[0].message));
		});
	},
	
	login: (req,res) => {
		const { email } = req.body;
		let where = {};
		
		if (validateEmail(email)) {
			where.email = email;
		} else if (validatePhone(email)) {
			where.phoneNumber = email;
		} else {
			where.username = email;
		}

		User.findOne({ where, raw:true },).then((user) => {
			const checkLogin = bcrypt.compareSync(req.body.password,user.password);
			if (checkLogin) {
				var token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET);

				
				if (token) {
					delete user.password;
					var data = { ...user, token};
					res.status(200).json(Response.writeResponse(`Success Sign In`,null,data,null));
				}
			} else {
				res.status(200).json(Response.writeResponse(`Password Salah`,null,null,"Password did not match"));
			}
		}).catch(() => {
			res.status(404).json(Response.writeResponse(`User Not Found`,null,null,'User Not Found!!'));
		});
	},
	registrationAvailability: (req, res) => {
		const { username, email, phone } = req.query;
		let params = {} ;
		if (!username && !email && !phone) {
			res.json({err: 'Provide parameter'});
		}

		if (username) {
			params.username = username;
		} else if (email) {
			params.email = email;
		} else if (phone) {
			params.phoneNumber = phone;
		}

		User.findOne({where: params}).then((user)=> {
			if (user) {
				res.status(400).json({
					message: `${Object.keys(params)} has taken`,
				});
			} else {
				res.json({
					message: `${Object.keys(params)} Boleh digunakan`,
				});
			}
		}).catch((err)=>res.status(500).json({err: err.message})); 
	}
};
