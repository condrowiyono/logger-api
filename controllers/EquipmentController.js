import model from '../models';
import sequelize from 'sequelize';
import Pagination from './Helper/Pagination';
import Response from './Helper/Response';

const {Op} = sequelize;
const {Facility, Subfacility, Equipment} = model;

module.exports = {
	getEquipments: (req,res) => {
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

		Equipment.findAndCountAll({
			where,
		}).then((data) => {
			let pages = Math.ceil(data.count / paginate.limit);
			paginate.offset = paginate.limit * (paginate.page-1);
			Equipment.findAll({
				where,
				include: ['facility','subfacility'],
				limit: paginate.limit,
				offset: paginate.offset
			}).then((eq)=> {
				res.status(200).json({
					message: `Search for Equipment`,
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
	getEquipment: (req, res) => {
		const {id} = req.params;
		Equipment.findByPk(
			id,
			{
				include: ['facility','subfacility']
			}).then((eq) => {
			if (eq === null) {
				res.status(404).json({
					message: `Eq Not Found`,
				});
			} else {
				res.status(200).json({
					message: `Get an Eq with id ${id}`,
					data: eq
				});
			}
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	
	createEquipment: (req, res) => {
		const {facility_id, subfacility_id, name, location, attributes, brand, quantity, year_installed, desc} = req.body;
		  
		Equipment.create({
			facilityId: facility_id,
		    subfacilityId: subfacility_id,
		    location: location,
		    name: name,
		    attributes: attributes,
		    brand: brand,
		    quantity: quantity,
		    yearInstalled: year_installed,
		    desc: desc,
		}).then((eq) => {
			Equipment.findByPk(eq.id).then((eq)=> {
				res.status(201).json({
					message: `Success Created New Eq`,
					data: eq
				});
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message
			});
		});
	},
	deleteEquipment: (req, res) => {
		const {id} = req.params;
		let eqData;
		Equipment.findByPk(id).then((eq) => {
			eqData = eq;
			return eq.destroy();
		}).then(() => {
			res.status(200).json({
				message: `Success Deleted an Eq`,
				data: eqData
			});
		}).catch((err) => {
			res.status(404).json({
				message: err.message
			});
		});
	},
	updateEquipment: (req, res) => {
		const {id} = req.params;
		const {facility_id, subfacility_id, name, location, attributes, brand, quantity, year_installed, desc} = req.body;
        
		Equipment.findByPk(id).then((eq) => {
			eq.update({
				facilityId: facility_id,
			    subfacilityId: subfacility_id,
			    location: location,
			    name: name,
			    attributes: attributes,
			    brand: brand,
			    quantity: quantity,
			    yearInstalled: year_installed,
			    desc: desc,
			}).then((eq) => {
				Equipment.findByPk(eq.id).then((eq)=> {
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
};
