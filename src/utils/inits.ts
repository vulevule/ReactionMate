import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { User, Admin } from './../model/User';
import { brightnessMetric, circleMetric, pillMetric, rectangleMetric, squareMetric, triangleMetric } from './metrics';
import { toast } from 'react-toastify';
import { getAllConfigs } from '../services';

export const useStateWithStorage = <T = any>(storageKey: string, initializeIfNull = true): [T, Dispatch<SetStateAction<T>>] => {
	const item = sessionStorage.getItem(storageKey);
	const [value, setValue] = useState<T>(
		item ? JSON.parse(item as string) : initializeIfNull ? initializer[storageKey] : null
	);

	useEffect(() => {
		sessionStorage.setItem(storageKey, JSON.stringify(value));
	}, [value]);

	return [value, setValue];
};

export const initGuestUser: () => User = () => (
	{
		username: 'guest',
		name: 'Guest user',
		email: '',
		created: new Date(),
		scores: {
			simple: [],
			choice: [],
			discrimination: [],
			recognition: []
		}
	}
)

export const initBlankAdmin: () => Admin = () => (
	{
		username: '',
		name: '',
		email: '',
		created: new Date()
	}
)

export const initConfig = async () => {
	const [data, status] = await getAllConfigs();
	if (data && status === 200) {
		sessionStorage.setItem('config', JSON.stringify(data));
		return data
	} else {
		toast.error(`Error while loading configurations: ${data}`)
		return {
			general: {
				tries: 5,
				minTimeout: 2000,
				maxTimeout: 4000
			},
			simple: {},
			recognition: {},
			choice: {},
			discrimination: {},
		}
	}

}

export const initializer: any = {
	user: initGuestUser(),
	config: initConfig()
}

type StimulusType = 'area' | 'length' | 'brightness';

export interface ShapeConfig {
    name: string;
    metric: (...args: JSX.Element[]) => number;
    props: ShapeProp[];
}

export interface ShapeProp {
    name: string;
    range: { [key in 'min' | 'max']: number };
}

export interface StimulusTypeConfig {
    title: string;
    config: { [key in 'first' | 'second']: ShapeConfig[] };
}

const sizeProp = (min = 150, max = 250) => ({
	name: 'size',
	range: { min, max }
})

const radiusProp = (min = 5, max = 70) => ({
	name: 'radius',
	range: { min, max }
})

const widthProp = (min = 150, max = 250) => ({
	name: 'width',
	range: { min, max }
})

const heightProp = (min = 150, max = 250) => ({
	name: 'height',
	range: { min, max }
})

const opacityProp = (min = 0.4, max = 1) => ({
	name: 'opacity',
	range: { min, max }
})

const rotateProp = (min = 0, max = 360) => ({
	name: 'rotate',
	range: { min, max }
})

const areaDefaultConfig = [
	{
		name: 'square',
		metric: squareMetric,
		props: [sizeProp(), radiusProp(), rotateProp()]
	},
	{
		name: 'circle',
		metric: circleMetric,
		props: [sizeProp()]
	},
	{
		name: 'triangle',
		metric: triangleMetric,
		props: [sizeProp(50, 100), rotateProp()]
	},
	{
		name: 'pill',
		metric: pillMetric,
		props: [widthProp(), heightProp(), rotateProp()]
	},
	{
		name: 'rectangle',
		metric: rectangleMetric,
		props: [widthProp(), heightProp(), radiusProp(), rotateProp()]
	}
]

const lengthDefaultConfig = [
	{
		name: 'pill',
		metric: pillMetric,
		props: [widthProp(150, 300), heightProp(5, 5), rotateProp()]
	},
]

const brightnessDefaultConfig = [
	{
		name: 'square',
		metric: brightnessMetric,
		props: [sizeProp(), radiusProp(), opacityProp(), rotateProp()]
	},
	{
		name: 'circle',
		metric: brightnessMetric,
		props: [sizeProp(), opacityProp()]
	},
	{
		name: 'triangle',
		metric: brightnessMetric,
		props: [sizeProp(50, 100), opacityProp(), rotateProp()]
	},
	{
		name: 'pill',
		metric: brightnessMetric,
		props: [widthProp(), heightProp(), opacityProp(), rotateProp()]
	},
	{
		name: 'rectangle',
		metric: brightnessMetric,
		props: [widthProp(), heightProp(), radiusProp(), opacityProp(), rotateProp()]
	}
]

export const stimulusConfig: { [key in StimulusType]: StimulusTypeConfig } = {
	area: {
		title: 'Which one is BIGGER?',
		config: {
			first: areaDefaultConfig,
			second: areaDefaultConfig
		}
	},
	length: {
		title: 'Which one is LONGER?',
		config: {
			first: lengthDefaultConfig,
			second: lengthDefaultConfig
		}
	},
	brightness: {
		title: 'Which one is BRIGHTER?',
		config: {
			first: brightnessDefaultConfig,
			second: brightnessDefaultConfig
		}
	}
}
