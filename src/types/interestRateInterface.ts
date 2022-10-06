export interface IInterestRate {
  type: "PERCENTAGE_PER_DURATION" | "FIXED_PER_DURATION";
  duration: "DAY" | "WEEK" | "MONTH" | "YEAR" | "FULL_DURATION";
  expectedPayments: "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  amount: number;
  isCompounding: boolean;
  entryTimestamp: number;
}
