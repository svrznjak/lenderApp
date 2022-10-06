import { ITransactionAddress } from "./transactionAddressInterface.js";

export interface ITransaction {
  _id: string;
  userId: string;
  transactionTimestamp: number;
  description: string;
  from: ITransactionAddress;
  to: ITransactionAddress;
  amount: number;
  entryTimestamp: number;
}
