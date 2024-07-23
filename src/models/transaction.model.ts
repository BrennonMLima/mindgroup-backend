import { Entity, Column, ManyToOne } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "../models/user.model";

@Entity()
export class Transactions extends BaseModel {
  @Column()
  description: string;

  @Column()
  price: string;

  @Column({ type: "enum", enum: ["Receita", "Despesa"] })
  type: "Receita" | "Despesa";

  @Column()
  date: Date;

  @Column()
  category: string;

  @ManyToOne(() => Users, user => user.transactions)
  user: Users;
}
