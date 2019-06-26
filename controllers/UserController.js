import model from '../models';
import sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import Pagination from './Helper/Pagination';
import Response from './Helper/Response';
import crypto from 'crypto';

const {Op} = sequelize;
const {User} = model;

module.exports = {
	getOnlyUsers: (req,res) => {
		const {name} = req.query;
		var where = {};
		if (name) {
			where.name = name;
		};
		
		User.findAndCountAll({
			where,
		}).then((data) => {
			User.findAll({
				where,
				attributes: ['id','name'],
			}).then((users)=> {
				let message= `Get All User (Name Only)`;
				let meta= {total: data.count};
				res.status(200).json(Response.writeResponse(message,meta,users,null));
			}).catch((err)=> {
				res.status(500).json(Response.writeResponse(err.message,null,null,err));
			});
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	getUsers: (req,res) => {
		const {page,name,sort,role} = req.query;
		var {limit} = req.query;
		//Prepare Pagination
		if (!limit) {
			limit = 16;
		}
		var paginate = Pagination.pagination(limit,0,page);
		
		//Prepare Attribute

		//Prepare Ordering

		//Prepare Filtering
		var where = {};
		if (name) {
			where.name = { [Op.like] : `%${name}%` };
		}

		var order=[];
		if (sort === 'created_desc') {
			order.push(['createdAt', 'DESC']);
		} else if (sort === 'created_asc') {
			order.push(['createdAt', 'ASC' ]);
		} else if (sort === 'name_desc') {
			order.push(['name', 'DESC']);
		} else if (sort === 'name_asc') {
			order.push(['name', 'ASC' ]);
		} else if (sort === 'role_desc') {
			order.push(['role', 'DESC']);
		} else if (sort === 'role_asc') {
			order.push(['role', 'ASC' ]);
		} else {
			order.push(['createdAt', 'DESC' ]);
		}
		
		if (role) {
			var whereRole = [];
			role.forEach(el => {
				whereRole.push({ [Op.eq] : el});
			});
			where.role = {[Op.or] : whereRole }
		}

		User.findAndCountAll({
			where,
		}).then((data) => {
			let pages = Math.ceil(data.count / paginate.limit);
			paginate.offset = paginate.limit * (paginate.page-1);
			User.findAll({
				where,
				order,
				limit: paginate.limit,
				offset: paginate.offset
			}).then((users)=> {
				let message= `Get All User`;
				let meta= Response.meta(200,paginate.page,pages,data.count);
				res.status(200).json(Response.writeResponse(message,meta,users,null));
			}).catch((err)=> {
				res.status(500).json(Response.writeResponse(err.message,null,null,err));
			});
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	getUser: (req, res) => {
		const {id} = req.params;

		User.findByPk(id).then((user) => {
			if (user === null) {
				return res.status(404).json({ message: `User Not Found` });
			}

			res.status(200).json(Response.writeResponse(`Get an User with id ${id}`,null,user,null));
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	getMe: (req, res) => {
		const {id} = req.user;

		User.findByPk(id).then((user) => {
			res.status(200).json(Response.writeResponse("My Profile",null,user,null));
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	createUser: (req, res) => {
		const {name,username,email,password,phone_number,position,address} = req.body;
		
		var data = {
			name,
			username,
			email,
			password,
			phoneNumber: phone_number,
			position,
			address,
		};
		
		User.create(data).then((user) => {
			res.status(201).json(Response.writeResponse("Success Create New User",null,user,null));
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	deleteUser: (req, res) => {
		const {id} = req.params;
		let userData;
		User.findByPk(id).then((user) => {
			if (user === null) {
				return res.status(404).json({ message: `User Not Found` });
			}
			userData = user;
			return user.destroy();
		}).then(() => {
			res.status(201).json(Response.writeResponse("Success Deleted an User",null,userData,null));
		}).catch((err) => {
			res.status(500).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	updateUser: (req, res) => {
		const {id} = req.params;
		const {name,username,email,password,phone_number,position,address} = req.body;
		
		let data = {
			name,
			username,
			email,
			phoneNumber: phone_number,
			position,
			address,
		};
		if (password) {
			data.password = bcrypt.hashSync(password,10);
		}
		
		User.findByPk(id).then((user) => {
			if (user === null) {
				return res.status(404).json({ message: `User Not Found` });
			}

			user.update(data).then((user) => {
				User.findByPk(user.id).then((user)=> {
					res.status(200).json(Response.writeResponse("Success Edit an User",null,user,null));
				});
			});
		}).catch((err) => {
			res.status(404).json(Response.writeResponse(err.message,null,null,err));
		});
	},
	changePassword: (req, res) => {
		const {id} = req.params;
		const {old_password,new_password,verify_new_password} = req.body;

		User.findOne({ where: { id } } ).then((user) => {
			const checkLogin = bcrypt.compareSync(old_password, user.password);
			if (checkLogin) {
				if (new_password===verify_new_password) {
					user.update({ password: bcrypt.hashSync(new_password,10) }).then(()=> {
						res.status(200).json(Response.writeResponse("Password Berhasil diganti",null,user,null));
					});
				} else {
					res.status(200).json(Response.writeResponse(`Password Tidak Sama`,null,null,"Password did not match"));
				}
			} else {
				res.status(200).json(Response.writeResponse(`Password Salah`,null,null,"Password did not match"));
			}
		}).catch((err) => {
			res.status(404).json(Response.writeResponse(`User Not Found`,null,null,err.message));
		});
	}
};