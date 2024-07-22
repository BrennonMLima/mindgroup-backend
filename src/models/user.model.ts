import { Entity, Column,OneToMany } from "typeorm";
import { BaseModel } from "./base.model";
import { Transactions } from "../models/transaction.model";

@Entity()
export class Users extends BaseModel {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "blob", nullable: true })
  image: Buffer;

  @OneToMany(() => Transactions, transaction => transaction.user)
  transactions: Transactions[];
}
