import { hash, compare } from 'bcrypt';
import { User } from "../models/user";
import { ClientRepository } from "../repositories/Client";


export class ClientService {
  
  readonly clientRepository: ClientRepository;
  readonly _SALT_ROUNDS = 10;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  public async createClient(user: User) {
    try {
      user.password = await this.protectedPassword(user?.password ?? '');
      return await this.clientRepository.createClient(user);
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to make the hash in password');
    }
  }

  public async updateClient(user: User) {
    try {
      return await this.clientRepository.updateClient(user);
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to make the hash in password');
    }
  }

  public async getUserByEmail(email: any){
    return await this.clientRepository.getUserByEmail(email);    
  }

  public async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await compare(password, hashedPassword);
    return isValid;
  };

  public async getClients() {
    return await this.clientRepository.getClients();
  }

  public async getClientById(id: string) {
    return await this.clientRepository.getClientById(id);
  }
  
  private async protectedPassword(password: string): Promise<string>  {
    try {
      return await hash(password, this._SALT_ROUNDS);
    } catch (error) {
      console.log('error', error)
      throw new Error('Failed in hash');
    }
  };
    
}
