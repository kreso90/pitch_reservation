import { addHours,format,formatISO, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale";

const shortDays = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const formatDate = (date: Date | undefined) => {
  if (!date) return 'No date available';
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatTime = (date: Date | undefined) => {
  if (!date) return 'No time available';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDay = (dayIndex: number | undefined, dayShort?: boolean | false) => {
  if (dayIndex === undefined || dayIndex < 0 || dayIndex > 6) return 'No day available';
  return dayShort ? days[dayIndex] : shortDays[dayIndex];
};

export const formatStringToDate = (dateStr: string): string => {
  const parsed = parse(dateStr, 'EEE do MMMM yyyy', new Date(), { locale: enUS });
  if (!isValid(parsed)) return 'No time available';

  return format(parsed, 'EEE do', { locale: enUS });
};


export const parseTimeStringToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};


export const createDateFromStringAndNumber = (dayLabel: string, hour?: number): Date => {
  const parsedDate = parse(dayLabel, 'EEE do MMMM yyyy', new Date());

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth();
  const day = parsedDate.getDate();

  const fullDate = new Date(year, month, day, hour, 0, 0);
  return fullDate;
};


export const formatToISODateTime = (dateTimeStr: string, hours?: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const dateWithYear = `${dateTimeStr}, ${year}`;
  
  const parsed = parse(dateWithYear, "EEEE, MMM d, HH:mm, yyyy", new Date());

  if (isNaN(parsed.getTime())) {
    throw new Error("Invalid date format");
  }

  const oneHourLater = addHours(parsed, hours ?? 0);

  return formatISO(oneHourLater);
};


export const combineDateAndTime = (dateOnly: Date, dateWithTime: Date): Date => {

  const year = dateOnly.getFullYear();
  const month = dateOnly.getMonth(); 
  const day = dateOnly.getDate();

  const hour = dateWithTime.getHours();
  const minute = dateWithTime.getMinutes();

  return new Date(year, month, day, hour, minute);
}

export const allDaysOfWeek = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
  { value: 6, label: "Sunday" },
];