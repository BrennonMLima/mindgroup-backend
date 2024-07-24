import * as express from "express";
import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import protectedRoute, { TokenPayload } from "../security/guard";
import * as jwt from "jsonwebtoken";

const router = express.Router();

router.use(protectedRoute);

router.post("/", async (req: Request, res: Response) => {
  const { description, price, type, date, category } = req.body;
  const {authorization} = req.headers
  const token = authorization.split(' ')[1]

  try {
    const user = jwt.decode(token) as TokenPayload
    const transaction = await TransactionService.createTransaction(user.id, {
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
    const {authorization} = req.headers
    const token = authorization.split(' ')[1]
    const user = jwt.decode(token) as TokenPayload
    
    const transactions = await TransactionService.getTransactionsByUserId(user.id);
    
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


router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await TransactionService.deleteTransaction(id);
    res.status(202).send({ message: "Transação excluída com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao excluir transação." });
  }
});

router.get("/user/despesas", async (req: Request, res: Response) => {
  const {authorization} = req.headers
  const token = authorization.split(' ')[1]
  const user = jwt.decode(token) as TokenPayload
  try {
    const totalDespesas = await TransactionService.getTotalDespesas(user.id);
    return res.send({ totalDespesas });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar total de despesas do usuário." });
  }
});

router.get("/user/receitas", async (req: Request, res: Response) => {
  const {authorization} = req.headers
  const token = authorization.split(' ')[1]
  const user = jwt.decode(token) as TokenPayload
  try {
    const totalReceitas = await TransactionService.getTotalReceitas(user.id);
    return res.send({ totalReceitas });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar total de receitas do usuário." });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const transactionData = req.body;

  try {
    const updatedTransaction = await TransactionService.updateTransaction(id, transactionData);
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
