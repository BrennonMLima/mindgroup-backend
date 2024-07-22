import { Entity, Column, ManyToOne } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "../models/user.model";

@Entity()
export class Transactions extends BaseModel {
  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: "enum", enum: ["income", "expense"] })
  type: "income" | "expense";

  @Column()
  date: Date;

  @Column()
  category: string;

  @ManyToOne(() => Users, user => user.transactions)
  user: Users;
}
