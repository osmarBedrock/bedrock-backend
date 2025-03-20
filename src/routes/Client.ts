import express from 'express';
import { ClientController } from '../controllers/users';
import { validateEmail } from '../middleware/authMiddleware';

const router = express.Router();

// POST: Create a new client
router.post('/signup', validateEmail, ClientController.createClient);

router.post('/signin', ClientController.logIn);

// GET: Retrieve all clients
router.get('/', ClientController.getClients);

// GET: Retrieve a client by ID
router.get('/:id', ClientController.getClientById);

// PUT: Update a client by ID
router.put('/:id', ClientController.updateClient);

// DELETE: Delete a client by ID
router.delete('/:id', ClientController.deleteClient);

export default router;
