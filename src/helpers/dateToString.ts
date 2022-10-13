export default function dateToString(date: Date): string {
  const year = date.getFullYear().toString();
  let month = (date.getUTCMonth() + 1).toString();
  if (month.length === 1) month = "0" + month;
  let day = date.getDate().toString();
  if (day.length === 1) day = "0" + day;
  let hour = date.getHours().toString();
  if (hour.length === 1) hour = "0" + hour;
  let minute = date.getMinutes().toString();
  if (minute.length === 1) minute = "0" + minute;
  let second = date.getSeconds().toString();
  if (second.length === 1) second = "0" + second;

  return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
}
