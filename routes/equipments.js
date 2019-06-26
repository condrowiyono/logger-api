import express from 'express';
import { getEquipments, getEquipment, createEquipment, deleteEquipment, updateEquipment} from '../controllers/EquipmentController';

const router = express.Router();

router.get('/', getEquipments);
router.get('/:id', getEquipment);
router.post('/', createEquipment);
router.delete('/:id',deleteEquipment);
router.put('/:id', updateEquipment);


export default router;
