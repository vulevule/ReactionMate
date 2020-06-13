import { SpecificScore } from '../model/User';
import { FormInput } from './../components/utilities/Forms';
import { TestConfiguration } from '../model/Experiment';
import { Experiment } from './../model/Experiment';

const api = process.env.REACT_APP_API_URL

interface CreateExperimentData {
  token: string;
  requiredData: FormInput[];
  testsConfig: TestConfiguration[];
  expiration: string;
  allowMultipleAnswers: boolean;
}

interface UpdateExperimentData extends CreateExperimentData {
  id: string;
  disabled: boolean;
}

const initExperiment = (exp: any) => {
	const parsed: Experiment = {
		...exp,
		link: `${window.location.origin}/test/${exp.id}`,
		expiration: new Date(exp.expiration),
		created: new Date(exp.created),
	}

	parsed.testsConfig.forEach(test => {
		test.tries = +test.tries;
	})

	return parsed;
}

export const getExperiment = async (id: string) => {
	const experiment = await fetch(`${api}/test/${id}`).then(async resp => {
		if (resp.ok) {
			const exp = await resp.json();

			const parsed: Experiment = initExperiment(exp);

			return [parsed, resp.status]
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})

	return experiment;
}

export const getAllExperiments = async (token: string) => {
	const experiment = await fetch(`${api}/getAllExperiments`, {
		headers: {
			'Authorization': `Token ${token}`
		}
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.json();

			const parsed: Experiment[] = data.map((exp: Record<string, string>) => initExperiment(exp))

			return [parsed, resp.status]
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})

	return experiment;
}

export const createExperiment = async (data: CreateExperimentData) => {
	const { token, ...params } = data
	return await fetch(`${api}/createExperiment`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`
		},
		body: JSON.stringify(params)
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.json();
			const { expiration, created, id, ...props } = data;
			const experiment: Experiment = {
				...props,
				id,
				link: `${window.location.origin}/test/${id}`,
				expiration: new Date(expiration),
				created: new Date(created),
			}
			return [experiment, resp.status]
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})
}

export const updateExperiment = async (data: UpdateExperimentData) => {
	const { id, token, ...params } = data
	return await fetch(`${api}/updateExperiment/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`
		},
		body: JSON.stringify(params)
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.json();
			const { expiration, created, id, ...props } = data;
			const experiment: Experiment = {
				...props,
				id,
				link: `${window.location.origin}/test/${id}`,
				expiration: new Date(expiration),
				created: new Date(created),
			}
			return [experiment, resp.status]
		} else {
			const data = await resp.text();
			return [data, resp.status]
		}
	})
}

export const deleteExperiment = async (id: string, token: string) => {
	return await fetch(`${api}/deleteExperiment/${id}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Token ${token}`
		}
	}).then(async resp => {
		const data = await resp.text();
		return [data, resp.status]
	})
}

export const saveExperimentResult = async (id: string, scores: SpecificScore[], requiredData: Record<string, any>) => {
	return await fetch(`${api}/saveTest/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			scores,
			requiredData
		})
	})
}
