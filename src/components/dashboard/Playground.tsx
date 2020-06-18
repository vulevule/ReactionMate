import React, { useState, useEffect, useRef } from 'react'
import './playground.scss'
import { TiWarningOutline } from 'react-icons/ti'
import { IoIosTimer } from 'react-icons/io';
import { GiSplitCross } from 'react-icons/gi';
import { useStateWithStorage, getRandomArbitrary, average, percentage } from '../../utils';
import { SaveScoreData, saveScore as saveScoreAPI } from './../../services';
import { ReactionTimeType } from '../../model/Types';
import { toast } from 'react-toastify';
import { SpecificScore } from '../../model/User';
import { User } from './../../model/User';
import { useHistory } from 'react-router-dom';

export interface ExperimentMode {
	lastTest?: boolean;
	onSaveTestScore?: (data: SpecificScore) => void;
	tries: number;
}

interface PlaygroundProps {
	type: ReactionTimeType;
	startScreen: JSX.Element;
	stimulusScreen: JSX.Element;
	waitScreen?: JSX.Element;
	correctReactionScreen?: JSX.Element;
	wrongReactionScreen?: JSX.Element;
	untimedReactionScreen?: JSX.Element;
	resultScreen?: JSX.Element;

	/**
	 * When false, all content and user reaction handling will be set in parent component where the stimulus component is created
	 */
	staticStimulusContent?: boolean;

	/**
	 * Allowed keyboard keys on stimulus screen.
	 * Default space and enter.
	 */
	stimulusKeys?: string[];

	experimentMode?: ExperimentMode;
}

export const Playground: React.FC<PlaygroundProps> = ({
	type,
	staticStimulusContent = false,
	startScreen,
	stimulusScreen,
	waitScreen,
	correctReactionScreen,
	wrongReactionScreen,
	untimedReactionScreen,
	resultScreen,
	stimulusKeys = [' ', 'Enter'],
	experimentMode,
}: PlaygroundProps) => {
	const { tries: maxTestTries, lastTest, onSaveTestScore } = experimentMode || {};

	const [config] = useStateWithStorage('config');
	const [user, setUser] = useStateWithStorage<User>('user');

	const maxTries = maxTestTries || config[type].tries || config.general.tries;
	const minTimeout = config[type].minTimeout || config.general.minTimeout;
	const maxTimeout = config[type].maxTimeout || config.general.maxTimeout;
	// const enableKeyboard = config.simple.enableKeyboard || config.general.enableKeyboard
	const enableKeyboard = true;

	const [status, setStatus] = useState(initStatus());
	const [stimulusColor, setStimulusColor] = useState('green');
	const time = useRef(0);
	const timerIntervalTrigger = useRef(0);
	const stimulusTimeoutTrigger = useRef(0);

	const timerIncrementStep = 4;

	const history = useHistory();

	useEffect(() => {
		// Add something if needed
		return () => {
			clearStimulusTimeout();
			clearTimerInterval();
		}
	}, [])

	const setStateFromChild = (state: { [key: string]: any }) => {
		Object.keys(state).forEach(key => {
			const value = state[key]
			switch (key) {
			case 'stimulusColor':
				setStimulusColor(value);
				break;
			case 'time':
				if (value === 0) {
					clearTimerInterval();
					time.current = 0;
					startTimerInterval();
				} else time.current = value

				break;
			default:
				if (Object.keys(status).includes(key)) {
					setStatus(old => ({ ...old, [key]: value }))
				}
			}
		})
	}

	const start = () => {
		setStatus(old => ({ ...old, active: true, tryDone: false, finished: false, tryNo: 1, tries: [], wrongAnswers: 0 }))
		startStimulusTimeout();
	}

	const handleClick = (reactionCorrect = true) => {
		clearTimerInterval();
		if (reactionCorrect) {
			correctReaction();
		} else {
			wrongReaction();
		}

	}

	const correctReaction = () => {
		const tries = status.tries.concat(time.current);
		setStatus(old => ({ ...old, tryDone: true, displayStimulus: false, tries }))
		time.current = 0;
		if (status.tryNo === maxTries) {
			setStatus(old => ({ ...old, finished: true, active: false }))
		}
	}

	/**
		 * Increment try after last successfull
		 */
	const newTrySuccess = () => {
		setStatus(old => ({ ...old, tryDone: false, displayStimulus: false, untimed: false, failed: false, tryNo: old.tryNo + 1 }))
		startStimulusTimeout();
	}

	/**
		 * Try again after last failed
		 */
	const newTryFail = () => {
		setStatus(old => ({ ...old, tryDone: false, displayStimulus: false, untimed: false, failed: false }))
		startStimulusTimeout();
	}

	const wrongReaction = () => {
		time.current = 0;
		setStatus(old => ({ ...old, failed: true, displayStimulus: false, wrongAnswers: old.wrongAnswers + 1 }));
		window.setTimeout(newTryFail, 2000)
	}

	/**
		 * Reaction came too early
		 */
	const untimedReaction = () => {
		clearStimulusTimeout();
		setStatus(old => ({ ...old, untimed: true, wrongAnswers: old.wrongAnswers + 1 }));
		window.setTimeout(newTryFail, 2000)
	}

	/**
		 * Checks if the keyboard is enabled and the pressed key is allowed and calls the passed function
		 * @param e keypress event
		 * @param func callback function
		 * @param args callback function arguments
		 */
	const keyPress = (e: any, func: (...args: any[]) => void, ...args: any[]) => {
		if (enableKeyboard && stimulusKeys.includes(e.key)) {
			e.preventDefault();
			func(...args);
		}
	}

	const displayStimulus = () => {
		setStatus(old => ({ ...old, displayStimulus: true }))
		startTimerInterval();
	}

	const incrementTimer = () => {
		time.current = time.current + timerIncrementStep
	}

	const startStimulusTimeout = () => {
		stimulusTimeoutTrigger.current = window.setTimeout(displayStimulus, getRandomArbitrary(minTimeout, maxTimeout))
	}

	const startTimerInterval = () => {
		timerIntervalTrigger.current = window.setInterval(incrementTimer, timerIncrementStep);
	}

	const clearStimulusTimeout = () => {
		clearTimeout(stimulusTimeoutTrigger.current);
	}

	const clearTimerInterval = () => {
		clearInterval(timerIntervalTrigger.current);
	}

	const saveScore = async (e: any) => {
		e.stopPropagation();

		const { tries, wrongAnswers } = status

		const saveScoreData: SaveScoreData = {
			type,
			token: user.token,
			date: new Date(),
			average: average(tries),
			success: percentage(tries.length, tries.length + (wrongAnswers || 0)),
			best: Math.min(...tries)
		}

		if (!user.token?.length) {
			setUser(old => ({ ...old, scores: { ...old.scores, [type]: [saveScoreData].concat(old.scores[type]) } }))
			// window.location.pathname = '/stats/' + type;
			history.push(`/stats/${type}`)
		} else {
			const [data, status] = await saveScoreAPI(saveScoreData);

			if (data && status === 200) {
				setUser(data as User);
				// window.location.pathname = '/stats/' + type;
				history.push(`/stats/${type}`)
			} else {
				toast.error(data)
			}
		}
	}

	/** Used only in experiment mode */
	const saveExperimentScore = () => {

		const { tries, wrongAnswers } = status

		const saveScoreData: SpecificScore = {
			type,
			tries: tries.length,
			date: new Date(),
			average: average(tries),
			success: percentage(tries.length, tries.length + (wrongAnswers || 0)),
			best: Math.min(...tries)
		}

		onSaveTestScore?.(saveScoreData)
	}

	return (
		<div className={`hero${experimentMode ? '-exp' : ''} ${status.displayStimulus ? `bg-${stimulusColor}` : ''} ${(status.untimed || status.failed) ? 'bg-red' : ''}`}>
			{!status.active && !status.finished &&
				<StartScreen
					onClick={start}
					onKeyDown={e => keyPress(e, start)}
				>
					{startScreen}
				</StartScreen>}

			{status.active && !status.tryDone && !status.displayStimulus && !status.untimed && !status.failed &&
				<WaitScreen
					onClick={untimedReaction}
					onRightClick={untimedReaction}
					onKeyDown={e => keyPress(e, untimedReaction)}
				>
					{waitScreen}
				</WaitScreen>}

			{status.active && !status.tryDone && status.displayStimulus &&
				<StimulusScreen
					updateParentState={setStateFromChild}
					staticContent={staticStimulusContent}
					onClick={handleClick}
					onKeyDown={(e, ...args) => keyPress(e, handleClick, ...args)}
				>
					{stimulusScreen}
				</StimulusScreen>
			}

			{status.active && !status.tryDone && status.untimed &&
				<UntimedReactionScreen onKeyDown={e => e.preventDefault()}>
					{untimedReactionScreen}
				</UntimedReactionScreen>}

			{status.active && !status.tryDone && status.failed &&
				<WrongReactionScreen onKeyDown={e => e.preventDefault()}>
					{wrongReactionScreen}
				</WrongReactionScreen>}

			{status.active && status.tryDone &&
				<CorrectReactionScreen
					result={status.tries[status.tries.length - 1]}
					onKeyDown={e => keyPress(e, newTrySuccess)}
					onClick={newTrySuccess}
				>
					{correctReactionScreen}
				</CorrectReactionScreen>}

			{!status.active && status.finished &&
				<ResultScreen
					experimentMode={!!experimentMode}
					lastInExperiment={lastTest}
					result={status.tries[status.tries.length - 1]}
					onClick={experimentMode ? undefined : start}
					onKeyDown={e => keyPress(e, experimentMode ? saveExperimentScore : start)}
					saveScore={experimentMode ? saveExperimentScore : saveScore}
				>
					{resultScreen}
				</ResultScreen>}

			{(status.active || status.finished) &&
				<BottomStats tryNo={status.tryNo} maxTries={maxTries} tries={status.tries} wrongAnswers={status.wrongAnswers} />}
		</div>
	)

}

export interface ScreenProps {
	onClick?: (reactionCorrect?: boolean) => void;
	onRightClick?: () => void;
	onKeyDown?: (e?: any, ...args: any[]) => void;
	updateParentState?: (state: { [key: string]: any }) => void;
}

interface StaticContentProps extends ScreenProps {
	staticContent?: boolean;
}

interface CorrectReactionScreenProps extends ScreenProps {
	result: number;
	saveScore?: (...args: any[]) => void;
}

interface ResultScreenProps extends CorrectReactionScreenProps {
	experimentMode?: boolean;
	lastInExperiment?: boolean;
}



const PlaygroundWrapper: React.FC<StaticContentProps> = ({ staticContent = true, onClick, onRightClick, onKeyDown, updateParentState, children }) => {

	const [childElement, setChildElement] = useState<JSX.Element>(<div className='h-100' />);

	const handleRightClick = (e: any) => {
		e.preventDefault();
		onRightClick?.();
	}

	useEffect(() => {
		if (staticContent && onKeyDown) {
			window.addEventListener('keydown', onKeyDown)
			return () => {
				window.removeEventListener('keydown', onKeyDown)
			}
		} else if (!staticContent) {
			React.Children.forEach(children, element => {
				if (!React.isValidElement(element)) return
				setChildElement(React.cloneElement(element, { onClick, onRightClick, onKeyDown, updateParentState }))
			})
		}
	}, [])

	return staticContent ? (
		<div className='playground pointer' onClick={() => onClick?.()} onContextMenu={handleRightClick}>
			{children}
		</div>
	) : (
		<>{childElement}</>
	)
}

const WaitScreen: React.FC<ScreenProps> = ({ children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children || <h1>Wait for it...</h1>}
		</PlaygroundWrapper>
	)
}

const StimulusScreen: React.FC<StaticContentProps> = ({ children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children}
		</PlaygroundWrapper>
	)
}

const UntimedReactionScreen: React.FC<ScreenProps> = ({ children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children ||
				<>
					<TiWarningOutline size={'6rem'} />
					<br />
					<h1>Too early</h1>
				</>}
		</PlaygroundWrapper>
	)
}

const CorrectReactionScreen: React.FC<CorrectReactionScreenProps> = ({ result, children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children ||
				<>
					<IoIosTimer size={'6rem'} />
					<br />
					<h1 className='font-weight-bold'>{result}ms</h1>
					<p>Click to keep going</p>
				</>}
		</PlaygroundWrapper>
	)
}

const WrongReactionScreen: React.FC<ScreenProps> = ({ children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children ||
				<>
					<GiSplitCross size={'6rem'} />
					<br />
					<h1>Wrong answer</h1>
				</>}
		</PlaygroundWrapper>
	)
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, saveScore, experimentMode, lastInExperiment, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			<IoIosTimer size={'6rem'} />
			<br />
			<h1 className='font-weight-bold'>{result}ms</h1>
			{experimentMode ?
				<>
					{lastInExperiment ?
						<p>Nice job! You can now submit your scores</p>
						:
						<p>Nice job! Go for a next test</p>
					}
					<button className='btn btn-warning rounded-pill px-4' onClick={saveScore}>Next</button>
				</>
				:
				<>
					<p>Click to go for another round, or save your score</p>
					<button className='btn btn-warning rounded-pill' onClick={saveScore}>Save score</button>
				</>
			}

		</PlaygroundWrapper>
	)
}

const StartScreen: React.FC<ScreenProps> = ({ children, ...props }) => {
	return (
		<PlaygroundWrapper {...props}>
			{children}
		</PlaygroundWrapper>
	)
}

interface BottomStatsProps {
	tryNo: number;
	maxTries: number;
	tries: number[];
	wrongAnswers?: number;
}

const BottomStats: React.FC<BottomStatsProps> = ({ tryNo, maxTries, tries, wrongAnswers }) => {
	const scoresRowString = tries.map((t, i) => `${i + 1}: ${t}ms`).join(' | ')
	const scoresColumnString = tries.map((t, i) => `${i + 1}: ${t}ms`).map((t, i) => <span key={i}>{t}<br /></span>)

	return (
		<div className='row resp-width-wider results'>
			<p className={'col-8 col-sm-12 row'}>
				<span className='col-12 col-sm-4'>
					<span className='text-transparent'>Tries | </span>
					{tryNo} of {maxTries}
				</span>
				<span className='col-12 col-sm-4'>
					<span className='text-transparent'>Average | </span>
					{average(tries)}ms
				</span>
				<span className='col-12 col-sm-4'>
					<span className='text-transparent'>Success score | </span>
					{percentage(tries.length, tries.length + (wrongAnswers || 0))}%
				</span>
			</p>
			<p className='col-4 col-sm-12 text-transparent'>
				<span className='display-from-sm justify-content-center'>{scoresRowString}</span>
				<span className='display-to-sm flex-column'>{scoresColumnString}</span>
			</p>
		</div>
	)
}

interface Status {
	active: boolean;
	tryDone: boolean;
	finished: boolean;
	displayStimulus: boolean;
	untimed: boolean;
	failed: boolean;
	wrongAnswers: number;
	tryNo: number;
	tries: number[];
}

const initStatus = () => {
	const status: Status = {
		active: false,
		tryDone: false,
		finished: false,
		displayStimulus: false,
		untimed: false,
		failed: false,
		wrongAnswers: 0,
		tryNo: 1,
		tries: []
	}

	return status
}
