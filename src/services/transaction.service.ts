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
      transaction.user = user;
      Object.assign(transaction,transactionData); 

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

  static async getTotalDespesas(userId: string): Promise<number> {
    try {
      const user = await Users.findOneBy({ id: userId });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      const despesas = await Transactions.createQueryBuilder("transaction")
        .select("SUM(transaction.price)", "total")
        .where("transaction.type = :type", { type: "Despesa" })
        .andWhere("transaction.userId = :userId", { userId })
        .getRawOne();

      if (!despesas || !despesas.total) throw new NotFoundException("Nenhuma despesa encontrada para este usuário.");

      return parseFloat(despesas.total);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao calcular o total de despesas.");
    }
  }

  static async getTotalReceitas(userId: string): Promise<number> {
    try {
      const user = await Users.findOneBy({ id: userId });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      const receitas = await Transactions.createQueryBuilder("transaction")
        .select("SUM(transaction.price)", "total")
        .where("transaction.type = :type", { type: "Receita" })
        .andWhere("transaction.userId = :userId", { userId })
        .getRawOne();

      if (!receitas || !receitas.total) throw new NotFoundException("Nenhuma receita encontrada para este usuário.");

      return parseFloat(receitas.total);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao calcular o total de receitas.");
    }
  }
}
