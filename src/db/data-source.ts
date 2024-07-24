import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "",
  password: "",
  database: "mindgroup",
  entities: ["src/models/*.ts"],
  logging: true,
  synchronize: true,
});
