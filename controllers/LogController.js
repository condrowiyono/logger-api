import model from '../models';
import sequelize from 'sequelize';
import Pagination from './Helper/Pagination';
import Response from './Helper/Response';
import crypto from 'crypto';
import fs from 'fs';
import {Parser} from 'json2csv';

const {Op} = sequelize;
const {Log, Equipment, User,LogImage} = model;

module.exports = {
	getLogs: (req,res) => {
		const {page,name, date_from, date_to} = req.query;
		var {limit} = req.query;
		
		if (!limit) {
			limit = 100;
		}
		//Prepare Pagination
		var paginate = Pagination.pagination(limit,0,page);
		
		//Prepare Attribute

		//Prepare Ordering

		//Prepare Filtering
		var where = {};
		if (date_from && date_to ) {
			where.date = { [Op.between]: [date_from, date_to] };
		}
		var order=[];

		order.push(['createdAt', 'DESC' ]);

		Log.findAndCountAll({
			where,
		}).then((data) => {
			let pages = Math.ceil(data.count / paginate.limit);
			paginate.offset = paginate.limit * (paginate.page-1);
			Log.findAll({
				where,
				order,
				include: ['user','equipment'],
				limit: paginate.limit,
				offset: paginate.offset
			}).then((eq)=> {
				res.status(200).json({
					message: `Search for Logs`,
					meta: Response.meta(200,paginate.page,pages,data.count), 
					data: eq
				});
			}).catch((err)=> {
				res.status(500).json({
					message: err.message
				});
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	getLogsMonthly : (req,res) => {
		let {month,year} = req.query;
		let date_from, date_to;

		month = parseInt(month,10);
		year = parseInt(year,10);


		if (month==12) {
			date_from = `${year}-${month}-01`;
		 	date_to = `${year+1}-01-01`;
		} else {
		 date_from = `${year}-${month}-01`;
		 date_to = `${year}-${month+1}-01`;
		}

		var where = {};
		if (date_from && date_to ) {
			where.date = { [Op.between]: [date_from, date_to] };
		}
		var order=[];
		Log.findAll({
			order,
			raw:true,
		}).then((eq)=> {
			res.status(200).json({
				message: `Search for Logs by Month`,
				data: eq
			});
		}).catch((err)=> {
			res.status(500).json({
				message: err.message
			});
		});

		order.push(['createdAt', 'DESC' ]);
	},

	getLogsCSV: (req,res) => {
		const {page,name, date_from, date_to} = req.query;
		const fields = [
			{
			  label: 'Nama Peralatan',
			  value: 'equipment.name'
			},
			{
			  label: 'Nama Petugas',
			  value: 'user.name'
			},
			{
			  label: 'Tanggal',
			  value: 'date'
			},
			{
			  label: 'Shift',
			  value: 'shift'
			},
			{
			  label: 'Jam',
			  value: 'time'
			},
			{
			  label: 'Uraian Pekerjaan',
			  value: 'jobDesc'
			},
			{
			  label: 'Tindak Lanjut',
			  value: 'followUp'
			},
			{
			  label: 'Keterangan',
			  value: 'desc'
			}
			
		];

		var order=[];

		order.push(['createdAt', 'DESC' ]);
		var where = {};
		if (date_from && date_to ) {
			where.date = { [Op.between]: [date_from, date_to] };
		}
		Log.findAll({
			order,
			where,
			raw:true,
			include: ['user','equipment'],
		}).then((eq)=> {
			const json2csvParser = new Parser({ fields });
			const csv = json2csvParser.parse(eq);
			res.attachment('logs.csv');
			res.status(200).send(csv);
		}).catch((err)=> {
			res.status(500).json({
				message: err.message
			});
		});
	},
	getLog: (req, res) => {
		const {id} = req.params;
		Log.findByPk(
			id,
			{
				include: ['user','equipment','images']
			}).then((eq) => {
			if (eq === null) {
				res.status(404).json({
					message: `Log Not Found`,
				});
			} else {
				res.status(200).json({
					message: `Get an Log with id ${id}`,
					data: eq
				});
			}
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},

	createLog: (req, res) => {
		const {user_id, equipment_id, date, shift, time, job_desc, follow_up, desc,images} = req.body;

		Log.create({
			userId: user_id,
			equipmentId: equipment_id,
			date,
			shift,
			time,
			jobDesc: job_desc,
			followUp: follow_up,
			desc
		}).then((eq) => {
			Log.findByPk(eq.id).then((eq)=> {
				eq.setImages(images);
				res.status(201).json({
					message: `Success Created New Logs`,
					data: eq
				});
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	deleteLog: (req, res) => {
		const {id} = req.params;
		let eqData;
		Log.findByPk(id).then((eq) => {
			eqData = eq;
			return eq.destroy();
		}).then(() => {
			res.status(200).json({
				message: `Success Deleted an Logs`,
				data: eqData
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
	updateLog: (req, res) => {
		const {id} = req.params;
		const {user_id, equipment_id, date, shift, time, job_desc, follow_up, desc} = req.body;

		Log.findByPk(id).then((eq) => {
			eq.update({
				userId: user_id,
				equipmentId: equipment_id,
				date,
				shift,
				time,
				jobDesc: job_desc,
				followUp: follow_up,
				desc
			}).then((eq) => {
				Log.findByPk(eq.id).then((eq)=> {
					res.status(200).json({
						message: `Success Updated a Eq`,
						data: eq
					});
				});
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
	uploadLogImage: (req, res) => {
		//on multiple files
		if (req.file != undefined) {
			LogImage.create({
				path: `${process.env.BASE_URL}/${req.file.path}`,
				logId: null,
			}).then((image)=> {
				res.status(200).json({
					message: 'Uploaded',
					data: {
						url: image.path,
						id: image.id,
						uploadUrl: image.url,
						deleteUrl: `${process.env.BASE_URL}/logs/log_image/${image.id}`,
					}
				});
			});
		}
	},
	deleteLogImage: (req, res) => {
		const {id} = req.params;
		let imageData;
		LogImage.findByPk(id).then((venue) => {
			imageData = venue;
			return venue.destroy();
		}).then(() => {
			//jika berhasil
			let path = imageData.path.replace(`${process.env.BASE_URL}/`,'');
			fs.unlink(path,()=>{});
			res.status(200).json({
				message: `Success Deleted an LogImage`,
				data: imageData
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
};
