import express from 'express';
import { getEquipments, getEquipmentsCSV, getEquipment, getEquipmentByQrcode, createEquipment, deleteEquipment, updateEquipment,generateQrcode} from '../controllers/EquipmentController';

const router = express.Router();

router.get('/', getEquipments);
router.get('/download-csv', getEquipmentsCSV);
router.get('/get-by-qrcode/:qrcode', getEquipmentByQrcode);
router.get('/:id', getEquipment);
router.post('/', createEquipment);
router.delete('/:id',deleteEquipment);
router.put('/generate-qrcode/:id', generateQrcode);
router.put('/:id', updateEquipment);


export default router;
