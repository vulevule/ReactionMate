import React, { useEffect, useRef, useState } from 'react';
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { Circle, Pill, Rectangle, Square, Triangle } from '../../utilities/Shapes';
import { ScreenProps } from '../Playground';
import { getRandomArbitrary, getRandomArrayElement, getRandomProperty, ShapeConfig, stimulusConfig, StimulusTypeConfig } from './../../../utils';
import './discrimination.scss';

export const keyboardMap: { [key: string]: string } = {
	ArrowLeft: 'first',
	ArrowRight: 'second',
	ArrowUp: 'first',
	ArrowDown: 'second'
}

type ShapeMap = { [key: string]: JSX.Element };

const shapeMap: ShapeMap = {
	square: <Square />,
	rectangle: <Rectangle />,
	circle: <Circle />,
	pill: <Pill />,
	triangle: <Triangle />
}

export const DiscriminationStartScreen: React.FC = () => {
	return (
		<>
			<div className='flex-center-column-fullheight'>
				<h1>Test your discrimination <br className='display-to-sm' />reaction time</h1>
				<br />
				<h2>You will be presented simultaneously with <b>2</b> stimuluses, different in size, length or brightness</h2>
				<h2>Determine which one stands out more (left/right or up/down) and click on the corresponding stimulus as quickly as you can</h2>
				<h2>You can also use <FaArrowLeft /> <FaArrowRight /> <FaArrowUp /> <FaArrowDown /> keyboard buttons</h2>

				<br />
				<h4>Click anywhere to start</h4>
			</div>
		</>
	)
}

export const DiscriminationStimulusScreen: React.FC<ScreenProps> = ({ onClick, onRightClick, onKeyDown }) => {

	const correct = useRef('');
	const [displayedHelper, setDisplayedHelper] = useState<JSX.Element>()

	useEffect(() => {
		initStimulus();

		if (onKeyDown) {
			window.addEventListener('keydown', handleKeyPress)
			return () => {
				window.removeEventListener('keydown', handleKeyPress)
			}
		}
	}, [])

	const handleRightClick = (e: any) => {
		e.preventDefault();
      onRightClick?.();
	}

	const handleKeyPress = (e: any) => {
      onKeyDown?.(e, correct.current === keyboardMap[e.key]);
	}

	const handleClick = (clicked: string) => {
      onClick?.(correct.current === clicked);
	}

	const initStimulus = () => {

		const [, stimulusTypeConfig] = getRandomProperty<StimulusTypeConfig>(stimulusConfig);
		const { title, config } = stimulusTypeConfig;
		const { first, second } = config;

		const fShape: ShapeConfig = getRandomArrayElement(first)
		const sShape: ShapeConfig = getRandomArrayElement(second)

		const { name: fName, metric: fMetric, props: fPropsConfig } = fShape;
		const { name: sName, metric: sMetric, props: sPropsConfig } = sShape;

		const fProps: any = {};
		const sProps: any = {};

		fPropsConfig.forEach(prop => fProps[prop.name] = getRandomArbitrary(prop.range.min, prop.range.max))
		sPropsConfig.forEach(prop => sProps[prop.name] = getRandomArbitrary(prop.range.min, prop.range.max))

		const fRender = React.cloneElement(shapeMap[fName], fProps)
		const sRender = React.cloneElement(shapeMap[sName], sProps)

		correct.current = fMetric(fRender) > sMetric(sRender) ? 'first' : 'second';
		setDisplayedHelper(generateStimulusContent(title, fRender, sRender))
	}

	const generateStimulusContent = (title: string, first: JSX.Element, second: JSX.Element) => {

		return (
			<>
				<h3>{title}</h3>
				<div className='row h-100 w-100'>
					<div className='col-12 col-sm-6 flex-center-all' onClick={() => handleClick('first')}>
						{first}
					</div>
					<div className='col-12 col-sm-6 flex-center-all' onClick={() => handleClick('second')}>
						{second}
					</div>
				</div>
			</>)
	}

	return (
		<div className='playground' onContextMenu={handleRightClick}>
			<div className='displayed resp-width-wider'>
				{displayedHelper}
			</div>
		</div>
	)
}
