import express from 'express';
import { getFacilities, getFacility, createFacility, deleteFacility, updateFacility} from '../controllers/SubfacilityController';

const router = express.Router();

router.get('/', getFacilities);
router.get('/:id', getFacility);
router.post('/', createFacility);
router.delete('/:id',deleteFacility);
router.put('/:id', updateFacility);


export default router;
