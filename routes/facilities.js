import express from 'express';
import { getAll, getFacilities, getFacility, createFacility, deleteFacility, updateFacility} from '../controllers/FacilityController';

const router = express.Router();

router.get('/', getFacilities);
router.get('/get-all', getAll);
router.get('/:id', getFacility);
router.post('/', createFacility);
router.delete('/:id',deleteFacility);
router.put('/:id', updateFacility);


export default router;
