import express from 'express';
import { getLogs, getLogsCSV, getLog, createLog, deleteLog, updateLog, uploadLogImage, deleteLogImage } from '../controllers/LogController';
import uploadHelper from '../controllers/Helper/Upload';

const router = express.Router();

router.get('/', getLogs);
router.get('/download-csv', getLogsCSV);
router.get('/:id', getLog);
router.post('/', createLog);
router.delete('/:id',deleteLog);
router.put('/:id', updateLog);

router.post('/log_image', uploadHelper.generalUploadDashboard('logs'), uploadLogImage);
router.delete('/log_image/:id', deleteLogImage);

export default router;
