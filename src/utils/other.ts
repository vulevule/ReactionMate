export const validateInput = (e: any) => {
	const re = /[0-9a-zA-Z_.]+/g;
	if (!re.test(e.key)) {
		e.preventDefault();
	}
}

export const setIntervalImmediately = (func: Function, delay: number) => {
	func();
	return window.setInterval(func, delay);
}

type DateFormat = 'UTC' | 'ISO' | 'custom'

export const formatDate = (date: number | Date, format: DateFormat = 'UTC') => {
	const d = new Date(date);

	if (format === 'UTC') {
		return d.toUTCString()
	} else if (format === 'ISO') {
		return d.toISOString()
	} else {
		const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);
		const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
		const hour = new Intl.DateTimeFormat('ja', { hour: 'numeric', minute: 'numeric' }).format(d);
		// const minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
		return `${weekday}, ${day}/${month}/${year} - ${hour}`
	}
}

export const formatISOLocalDate = (date: number | Date) => {
	const d = new Date(date);
	const pad = (num: number) => {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return d.getFullYear() +
		'-' + pad(d.getMonth() + 1) +
		'-' + pad(d.getDate()) +
		'T' + pad(d.getHours()) +
		':' + pad(d.getMinutes()) +
		':' + pad(d.getSeconds())
}
