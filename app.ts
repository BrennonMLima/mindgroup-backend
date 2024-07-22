import * as express from "express";
import * as cors from "cors"
import {publicRouter, userRouter,transactionRouter } from "./src/routes";
import { AppDataSource } from "./src/db/data-source"
import exceptionsMiddleware from "./src/middleware/exceptions.middleware";

AppDataSource.initialize()
.then(()=> {
    console.log("Banco Inicializado!");
})
.catch((err)=>{
    console.log("Erro ao inicializar o banco.",err);
});

const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);
app.use("", publicRouter);
app.use(exceptionsMiddleware);

app.listen(8000);
