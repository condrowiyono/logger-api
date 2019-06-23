import express from 'express';
import { getOnlyUsers, getUsers, getUser, createUser, deleteUser, updateUser, getMe, changePassword } from '../controllers/UserController';

const router = express.Router();

router.get('/me', getMe);
router.get('/get-name-only', getOnlyUsers);
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id',deleteUser);
router.put('/:id', updateUser);
router.put('/change_password/:id', changePassword);

export default router;