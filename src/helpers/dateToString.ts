export default function dateToString(date: Date): string {
  const year = date.getFullYear().toString();
  let month = (date.getUTCMonth() + 1).toString();
  if (month.length === 1) month = "0" + month;
  let day = date.getDate().toString();
  if (day.length === 1) day = "0" + day;

  return year + "-" + month + "-" + day;
}
