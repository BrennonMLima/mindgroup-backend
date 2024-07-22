import { UserDTO } from "../dto/user.dto";
import { InternalException, NotFoundException } from "../exceptions";
import { Users } from "../models/user.model";
import { SecurityClass } from "../security/security";

export class UserService {
  static async getAllUsers(): Promise<Users[]> {
    try {
      const users = await Users.find();

      if (users.length === 0)
        throw new NotFoundException("Usuário não encontrado.");

      return users;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de usuários.");
    }
  }

  static async getUserById(userId: string): Promise<Users> {
    try {
      const user = await Users.findOneBy({ id: userId });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de usuários.");
    }
  }

  static async getUserByEmail(userEmail: string): Promise<Users> {
    try {
      const user = await Users.findOneBy({ email: userEmail });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de usuários.");
    }
  }

  static async createUser(userData: Users): Promise<UserDTO> {
    try {
      const userHashPassword = await SecurityClass.encryptUserPassword(
        userData.password
      );

      const user = Users.create({
        name: userData.name,
        email: userData.email,
        password: userHashPassword,
      });

      const newUser = await Users.save(user);

      return new UserDTO(
        newUser.name,
        newUser.email,
        newUser.createdAt,
        newUser.id,
        newUser.image
      );
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException(`Erro ao criar usuário`);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await Users.delete({ id: userId });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Erro ao deletar usuário`);
    }
  }
}
