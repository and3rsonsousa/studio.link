import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
export function isToday(date: Dayjs): boolean {
	return date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
}

export function isThisMonth(date: Dayjs): boolean {
	return date.format("YYYY-MM") === dayjs().format("YYYY-MM");
}

export function isThisYear(date: Dayjs): boolean {
	return date.format("YYYY") === dayjs().format("YYYY");
}

export function isLate(date: Dayjs): boolean {
	return date.isBefore(dayjs());
}

export function isFuture(date: Dayjs): boolean {
	return (
		date.isAfter(dayjs(dayjs().add(1, "day").format("YYYY-MM-DD"))) ||
		date.isSame(dayjs(dayjs().add(1, "day").format("YYYY-MM-DD")))
	);
}
