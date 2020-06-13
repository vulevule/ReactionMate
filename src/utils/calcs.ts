import { MS_IN_SECOND, MS_IN_MINUTE, MS_IN_HOUR, MS_IN_DAY, MS_IN_MONTH } from './consts';

export const getRandomArbitrary = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
}

export const getRandomProperty = <T = any>(obj: { [key: string]: any }): [string, T] => {
	const keys = Object.keys(obj);
	const key = keys[Math.floor(Math.random() * keys.length)];
	const value: T = obj[key];
	return [key, value]
}

export const getRandomArrayElement = (array: any[]) => {
	return array[Math.floor(Math.random() * array.length)]
}

export const average = (numberArray: number[]) => {
	if (!numberArray.length) return 0
	const avg = numberArray.reduce((acc, curr) => acc + curr) / numberArray.length
	return parseFloat(avg.toFixed(2))
}

export const percentage = (fraction: number, total: number) => {
	if (fraction === 0 || total === 0) return 0;
	const pct = fraction / total * 100
	return parseFloat(pct.toFixed(2))
}

export const countDecimals = (value: number) => {
	if (Math.floor(value) === value) return 0;
	return value.toString().split('.')[1].length || 0;
}

export const dateDiff = (date1: number | Date | string, date2: number | Date | string) => {
	const _date1 = date1 instanceof Date ? (date1 as Date).getTime() : (typeof (date1) === 'string' ? new Date(date1).getTime() : date1)
	const _date2 = date2 instanceof Date ? (date2 as Date).getTime() : (typeof (date2) === 'string' ? new Date(date2).getTime() : date2)

	const diff = _date2 - _date1;
	const seconds = Math.floor(diff / MS_IN_SECOND);
	const minutes = Math.floor(diff / MS_IN_MINUTE);
	const hours = Math.floor(diff / MS_IN_HOUR);
	const days = Math.floor(diff / MS_IN_DAY);
	const months = Math.floor(diff / MS_IN_MONTH);

	if (months) return `${months} ${months === 1 ? 'month' : 'months'}`
	else if (days) return `${days} ${days === 1 ? 'day' : 'days'}`
	else if (hours) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
	else if (minutes) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
	else return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
}

export const dateDiffNow = (date: number | Date | string) => {
	return dateDiff(date, new Date());
}

type Interval = 'year' | 'month' | 'day' | 'hour' | 'minute'

export const dateFromNow = (params: {[key in Interval]?: number}) => {
	const { year, month, day, hour, minute } = params;
    
	const date = new Date();
	const years = date.getFullYear();
	const months = date.getMonth();
	const days = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
    
	return new Date(
		years + (year || 0),
		months + (month || 0),
		days + (day || 0),
		hours + (hour || 0),
		minutes + (minute || 0)
	);
}
