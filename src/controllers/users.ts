import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken'
import { ClientService } from '../services/Client';
import { User } from '../models/user';

const clientRepository = new ClientService();

export class ClientController {
  /**
   * Create a new client
   * @param req Express Request object
   * @param res Express Response object
   */
  static async createClient(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    try {
      if (!firstName) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const newUser: User = new User(
        `${firstName} ${lastName}`,
        firstName, lastName, email,
        password, 
        null,
        '',
        new Date(),
        new Date(), 
        'WRITE', 
        null, 
        false);

      const client = await clientRepository.createClient(newUser);
      console.log('client', client)
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create client',
        message: error instanceof Error ? error.message : error,
      });
    }
  }

  /**
   * Get all clients
   * @param req Express Request object
   * @param res Express Response object
   */
  static async getClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await clientRepository.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch clients',
        message: error instanceof Error ? error.message : error,
      });
    }
  }

  static async logIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('email, password', email, password)
      const user: any = await clientRepository.getUserByEmail(email);
      if(!user){
        res.status(404).json({
          message: 'user not found'
        });
        return;
      }
      const isValid = await clientRepository.validatePassword(password, user?.password ?? '');
      console.log('user,isValid', user,isValid)
      if(!isValid){
        res.status(404).json({
          message: 'password not match'
        });
        return;
      }
      const token = sign( user, process.env.JWT_SECRET!, { expiresIn: '1h' });
      
      res.status(200).json({
        message: 'user found it',
        user, 
        token
      })
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch client by email',
        message: error instanceof Error ? error.message : error,
      })
    }
  }

  /**
   * Get a single client by ID
   * @param req Express Request object
   * @param res Express Response object
   */
  static async getClientById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const client = await clientRepository.getClientById(id);

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch client',
        message: error instanceof Error ? error.message : error,
      });
    }
  }
  /**
     * Get a single user by email
     * @param req Express Request object
     * @param res Express Response object
     */
  static async getClientByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.query;

    console.log(email, req.query)
    try {
      const client = await clientRepository.getUserByEmail(email);

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch client',
        message: error instanceof Error ? error.message : error,
      });
    }
  }
  /**
   * Update a client by ID
   * @param req Express Request object
   * @param res Express Response object
   */
  static async updateClient(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, id } = req.body;

    try {
      if (!firstName) {
        res.status(400).json({ error: 'First name is required' });
        return;
      }
      if (!lastName) {
        res.status(400).json({ error: 'Last name is required' });
        return;
      }

      const updateUser: User = new User(
        `${firstName} ${lastName}`,
        firstName, lastName,'','','','',undefined,undefined,undefined,null,false, id);
      const client = await clientRepository.updateClient(updateUser);

    res.json(client);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update client',
        message: error instanceof Error ? error.message : error,
      });
    }
  }

  /**
   * Delete a client by ID
   * @param req Express Request object
   * @param res Express Response object
   */
  static async deleteClient(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // try {
    // //   const client = await clientRepository.deleteClient(id);

    //   res.json({
    //     message: 'Client deleted successfully',
    //     client,
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     error: 'Failed to delete client',
    //     message: error instanceof Error ? error.message : error,
    //   });
    // }
  }
}
