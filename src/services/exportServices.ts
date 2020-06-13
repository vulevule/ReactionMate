
const api = process.env.REACT_APP_API_URL

interface ExportSingleParams {
  id: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ExportMultipleParams {
  createdFrom?: string;
  createdTo?: string;
  expirationFrom?: string;
  expirationTo?: string;
  allowMultipleAnswers?: boolean;
}

export const exportSingleExperimentResults = async (data: ExportSingleParams, token: string) => {
	const { id, dateFrom, dateTo } = data
	return await fetch(`${api}/exportSingle/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`
		},
		body: JSON.stringify({
			dateFrom,
			dateTo,
		})
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.blob();

			return [{ data, fileName: getFilename(resp) || initFilename(id) }, resp.status];
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})
}

export const exportMultipleExperimentResults = async (data: ExportMultipleParams, token: string) => {
	return await fetch(`${api}/exportMany`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`
		},
		body: JSON.stringify(data)
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.blob();

			return [{ data, fileName: getFilename(resp) || initFilename() }, resp.status];
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})
}

const getFilename = (response: Response) => {
	const header = response.headers.get('content-disposition');
	const fileName = header && header.split(';').find(n => n.includes('filename='))
	return fileName && fileName.replace('filename=', '').trim()
}

const initFilename = (id?: string) => {
	const date = new Date();
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-export${id ? `-${id}` : ''}.xlsx`
}
