import express from 'express';
import { ClientController } from '../controllers/users';

const router = express.Router();

router.get('/', ClientController.getClientByEmail);
router.patch('/:id', ClientController.updateClient);

export default router;