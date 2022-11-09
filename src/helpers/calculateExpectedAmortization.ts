import { IAmortizationInterval, IInterestRate } from "@/types/interestRateInterface";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
} from "date-fns";

export default function calculateExpectedLoanAmortization({
  openedTimestamp,
  closesTimestamp,
  interestRate,
  amount,
}: {
  openedTimestamp: number;
  closesTimestamp: number;
  interestRate: Omit<IInterestRate, "entryTimestamp" | "revisions">;
  amount: number;
}): IAmortizationInterval[] {
  // TODO: validate inputs
  const listOfPayments: IAmortizationInterval[] = [];
  const loanDurationInDays = differenceInCalendarDays(new Date(closesTimestamp), new Date(openedTimestamp));
  const principalPaymentPerDay = amount / loanDurationInDays;
  const interestPerDay = normalizeInterestRateToDay(interestRate);
  const paydaysTimestamps: number[] = getTimestampsOfPaydays({
    openedTimestamp: openedTimestamp,
    closesTimestamp: closesTimestamp,
    expectedPayments: interestRate.expectedPayments,
  });

  for (let i = 0; i < paydaysTimestamps.length; i++) {
    let outstandingPrincipal;
    let fromDateTimestamp;
    if (i === 0) {
      outstandingPrincipal = amount;
      fromDateTimestamp = openedTimestamp;
    } else {
      outstandingPrincipal = listOfPayments[i - 1].outstandingPrincipal - listOfPayments[i - 1].principalPayment;
      fromDateTimestamp = paydaysTimestamps[i - 1];
    }

    const toDateTimestamp = paydaysTimestamps[i];

    const differenceInDays = differenceInCalendarDays(new Date(toDateTimestamp), new Date(fromDateTimestamp));

    let interest = 0;
    if (interestRate.type === "PERCENTAGE_PER_DURATION" && interestRate.isCompounding) {
      const interestPercentagePerDay = interestPerDay / 100;
      for (let i = 0; i < differenceInDays; i++) {
        interest += (outstandingPrincipal + interest) * interestPercentagePerDay;
      }
    } else if (interestRate.type === "PERCENTAGE_PER_DURATION" && !interestRate.isCompounding) {
      const interestPercentagePerDay = interestPerDay / 100;
      interest = outstandingPrincipal * interestPercentagePerDay * differenceInDays;
    } else if (interestRate.type === "FIXED_PER_DURATION" && interestRate.duration !== "FULL_DURATION") {
      interest = interestPerDay * differenceInDays;
    } /* else if (interestRate.type === 'FIXED_PER_DURATION' && interestRate.duration === 'FULL_DURATION') {
        interest = interestRate.amount / loanDurationInDays;
      } */

    listOfPayments.push({
      fromDateTimestamp: fromDateTimestamp,
      toDateTimestamp: toDateTimestamp,
      outstandingPrincipal: outstandingPrincipal,
      interest: interest,
      principalPayment: differenceInDays * principalPaymentPerDay,
    });
  }

  // get amount of durations between fromDate and toDate
  // multiply durations by interestRate.Amount
  return listOfPayments;
}
function normalizeInterestRateToDay(interestRate: Omit<IInterestRate, "entryTimestamp" | "revisions">): number {
  if (interestRate.duration === "DAY") {
    return interestRate.amount;
  } else if (interestRate.duration === "WEEK") {
    return interestRate.amount / 7;
  } else if (interestRate.duration === "MONTH") {
    return interestRate.amount / 30;
  } else if (interestRate.duration === "YEAR") {
    return interestRate.amount / 365;
  } else if (interestRate.duration === "FULL_DURATION") {
    return interestRate.amount;
  } else {
    throw new Error("Error when calculating daily interest rate!");
  }
}

function getTimestampsOfPaydays({
  openedTimestamp,
  closesTimestamp,
  expectedPayments,
}: {
  openedTimestamp: number;
  closesTimestamp: number;
  expectedPayments: IInterestRate["expectedPayments"];
}): number[] {
  let paymentDaysTimestamps: number[] = [];

  if (expectedPayments === "DAILY") {
    paymentDaysTimestamps = eachDayOfInterval({
      start: openedTimestamp,
      end: closesTimestamp,
    }).map((date) => {
      return date.getTime();
    });
    paymentDaysTimestamps.shift();
  } else if (expectedPayments === "WEEKLY") {
    paymentDaysTimestamps = eachWeekOfInterval({
      start: openedTimestamp,
      end: closesTimestamp,
    }).map((date) => {
      return date.getTime();
    });
    paymentDaysTimestamps.shift();
    if (paymentDaysTimestamps[paymentDaysTimestamps.length - 1] !== closesTimestamp) {
      paymentDaysTimestamps.push(closesTimestamp);
    }
  } else if (expectedPayments === "MONTHLY") {
    paymentDaysTimestamps = eachMonthOfInterval({
      start: openedTimestamp,
      end: closesTimestamp,
    }).map((date) => {
      return date.getTime();
    });
    paymentDaysTimestamps.shift();
    if (paymentDaysTimestamps[paymentDaysTimestamps.length - 1] !== closesTimestamp) {
      paymentDaysTimestamps.push(closesTimestamp);
    }
  } else if (expectedPayments === "YEARLY") {
    paymentDaysTimestamps = eachYearOfInterval({
      start: openedTimestamp,
      end: closesTimestamp,
    }).map((date) => {
      return date.getTime();
    });
    paymentDaysTimestamps.shift();
    if (paymentDaysTimestamps[paymentDaysTimestamps.length - 1] !== closesTimestamp) {
      paymentDaysTimestamps.push(closesTimestamp);
    }
  } else if (expectedPayments === "ONE_TIME") {
    paymentDaysTimestamps.push(closesTimestamp);
  }
  return paymentDaysTimestamps;
}
