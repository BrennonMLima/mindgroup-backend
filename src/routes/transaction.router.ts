import * as express from "express";
import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import protectedRoute from "../security/guard";

const router = express.Router();

router.use(protectedRoute);

router.post("/", async (req: Request, res: Response) => {
  const { userId, description, price, type, date, category } = req.body;

  try {
    const transaction = await TransactionService.createTransaction(userId, {
      description,
      price,
      type,
      date,
      category,
    });

    return res.status(201).send({ transaction });
  } catch (error) {
    return res.status(500).send({ message: " transação." });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const transactions = await TransactionService.getAllTransactions();

    return res.send({ transactions });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar transações." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transaction = await TransactionService.getTransactionById(id);

    return res.send({ transaction });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar transação." });
  }
});

router.get("/user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const transactions = await TransactionService.getTransactionsByUserId(userId);

    return res.send({ transactions });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar transações do usuário." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await TransactionService.deleteTransaction(id);
    res.status(202).send({ message: "Transação excluída com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao excluir transação." });
  }
});

export default router;
