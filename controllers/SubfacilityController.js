import model from '../models';
import sequelize from 'sequelize';
import Pagination from './Helper/Pagination';
import Response from './Helper/Response';

const {Op} = sequelize;
const {Subfacility, Equipment} = model;

module.exports = {
	getFacilities: (req,res) => {
		const {page,name} = req.query;
		var {limit} = req.query;
		if (!limit) {
			limit = 16;
		}
		//Prepare Pagination
		var paginate = Pagination.pagination(limit,0,page);
		
		//Prepare Attribute

		//Prepare Ordering

		//Prepare Filtering
		var where = {};
		if (name) {
			where.name = { [Op.like] : `%${name}%` };
		}

		Subfacility.findAndCountAll({
			where,
		}).then((data) => {
			let pages = Math.ceil(data.count / paginate.limit);
			paginate.offset = paginate.limit * (paginate.page-1);
			Subfacility.findAll({
				where,
				include: ['facility'],
				limit: paginate.limit,
				offset: paginate.offset
			}).then((facilities)=> {
				res.status(200).json({
					message: `Search for Facility`,
					meta: Response.meta(200,paginate.page,pages,data.count), 
					data: facilities
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
	getFacility: (req, res) => {
		const {id} = req.params;
		Subfacility.findByPk(
			id,
			{
				paranoid: false,
				include: ['equipments','facility']
			}).then((facility) => {
			if (facility === null) {
				res.status(404).json({
					message: `Facility Not Found`,
				});
			} else {
				res.status(200).json({
					message: `Get an Facility with id ${id}`,
					data: facility
				});
			}
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	
	createFacility: (req, res) => {
		const {name,desc,facility_id} = req.body;
		
		Subfacility.create({
			facilityId: facility_id,
			name,
			desc,
		}).then((facility) => {
			Subfacility.findByPk(facility.id).then((facility)=> {
				res.status(201).json({
					message: `Success Created New facility`,
					data: facility
				});
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	deleteFacility: (req, res) => {
		const {id} = req.params;
		let facilityData;
		Subfacility.findByPk(id).then((facility) => {
			facilityData = facility;
			if (facility === null) {
				res.status(404).json({
					message: `Facility Not Found`,
				});
			} else {
				return facility.destroy();
			}
		}).then(() => {
			res.status(200).json({
				message: `Success Deleted an facility`,
				data: facilityData
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
	updateFacility: (req, res) => {
		const {id} = req.params;
		const {name,desc,facility_id} = req.body;
        
		Subfacility.findByPk(id).then((facility) => {
			facility.update({
				facilityId: facility_id,
				name,
				desc,
			}).then((facility) => {
				Subfacility.findByPk(facility.id).then((facility)=> {
					res.status(200).json({
						message: `Success Updated a facility`,
						data: facility
					});
				});
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
};
