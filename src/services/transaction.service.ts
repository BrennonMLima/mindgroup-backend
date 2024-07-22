import { InternalException, NotFoundException } from "../exceptions";
import { Transactions } from "../models/transaction.model";
import { Users } from "../models/user.model";

export class TransactionService {
  
  static async getAllTransactions(): Promise<Transactions[]> {
    try {
      const transactions = await Transactions.find();
      
      if (transactions.length === 0)
        throw new NotFoundException("Transações não encontradas.");

      return transactions;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de transações.");
    }
  }

  static async getTransactionById(transactionId: string): Promise<Transactions> {
    try {
      const transaction = await Transactions.findOneBy({ id: transactionId });
      if (!transaction) throw new NotFoundException("Transação não encontrada.");

      return transaction;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de transações.");
    }
  }

  static async getTransactionsByUserId(userId: string): Promise<Transactions[]> {
    try {
      const user = await Users.findOneBy({ id: userId });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      const transactions = await Transactions.find({ where: { user: { id: userId } } });

      if (transactions.length === 0)
        throw new NotFoundException("Transações não encontradas.");

      return transactions;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de transações.");
    }
  }


  static async createTransaction(userId: string, transactionData: Partial<Transactions>): Promise<Transactions> {
    try {
      const user = await Users.findOneBy({ id: userId });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      const transaction = new Transactions();
      transaction.description = transactionData.description;
      transaction.price = transactionData.price;
      transaction.type = transactionData.type;
      transaction.date = transactionData.date;
      transaction.category = transactionData.category;
      transaction.user = user; 

      const newTransaction = await Transactions.save(transaction);

      return newTransaction;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao criar transação.");
    }
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const result = await Transactions.delete({ id: transactionId });
      if (result.affected === 0) throw new NotFoundException("Transação não encontrada.");
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao deletar transação.");
    }
  }
}
