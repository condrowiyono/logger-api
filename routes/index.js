import express from 'express';
import { isAuth } from '../middleware/auth';
import { login, register } from '../controllers/AuthController';
import users from './users';
import facilities from './facilities';
import subfacilities from './subfacilities';
import equipments from './equipments';

const router = express.Router();

//Check API Status
router.get('/healthz', (req, res) => {
	res.status(200).send(`OK`);
});

//Auth
router.post('/register', register);
router.post('/login', login);

router.use('/users', isAuth, users);
router.use('/facilities', isAuth, facilities);
router.use('/subfacilities', isAuth, subfacilities);
router.use('/equipments', isAuth, equipments);

export default router;
