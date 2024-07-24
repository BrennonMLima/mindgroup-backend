import * as express from "express";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import protectedRoute, { TokenPayload } from "../security/guard";
import { UserDTO } from "../dto/user.dto";
import * as jwt from "jsonwebtoken";
import multer = require('multer');
import fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/'});

router.post("/", upload.single('image'), async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let imageData: Buffer | undefined;
  if (req.file) {
    try {
      imageData = fs.readFileSync(req.file.path);
    } catch (err) {
      console.error(`Erro ao ler a imagem: ${err}`);
      return res.status(500).send({ message: "Erro ao processar a imagem." });
    }
  }

  try {
    const user = await UserService.createUser({ name, email, password, image: imageData });
    const userDTO = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      image: user.image,
      id: user.id,
    } as UserDTO;

    return res.status(201).send({ user: userDTO });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar usuário." });
  }
});
router.use(protectedRoute);

router.get("/", async (req: Request, res: Response) => {
  const {authorization} = req.headers
  const token = authorization.split(' ')[1]
  try {
    const userid = jwt.decode(token) as TokenPayload
    const user = await UserService.getUserById(userid.id);
    const userDTO = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      image: user.image,
      id: user.id,
    } as UserDTO;

    return res.send({ user: userDTO });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar tabela de usuários." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await UserService.deleteUser(id);
    res.status(202).send({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao excluir usuário." });
  }
});

export default router;
