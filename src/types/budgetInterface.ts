import { IInterestRate } from "./interestRateInterface.js";

export interface IBudget {
  _id: string;
  name: string;
  description: string;
  defaultInterestRate: IInterestRate;
  calculatedTotalAmount: number;
  calculatedLendedAmount: number;
}
