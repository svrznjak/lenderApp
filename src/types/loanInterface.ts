import { IInterestRate } from "./interestRateInterface.js";
import { INote } from "./noteInterface.js";

export interface ILoan {
  _id: string;
  userId: string;
  name: string;
  description: string;
  notes: [INote?];
  openedTimestamp: number;
  closesTimestamp: number;
  interestRate: IInterestRate;
  initialPrincipal: number;
  status: "ACTIVE" | "PAUSED" | "PAID" | "CLOSED" | "DEFAULTED";
  calculatedTotalPaidPrincipal: number;
  calculatedChargedInterest: number;
  calculatedPaidInterest: number;
}
