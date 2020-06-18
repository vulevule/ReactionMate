import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { GiTimeBomb } from 'react-icons/gi';
import { MdErrorOutline, MdTimelapse } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SpecificScore } from '../../model/User';
import { getExperiment, saveExperimentResult } from '../../services/experimentServices';
import { ActivityFeedCard } from '../stats/Stats';
import { CustomDataForm, Form } from '../utilities/Forms';
import { Experiment, TestConfiguration } from './../../model/Experiment';
import { PageSpinner } from './../utilities/Loaders';
import { ExpChoice } from './ExpChoice';
import { ExpDiscrimination } from './ExpDiscrimination';
import './experimentPage.scss';
import { ExpRecognition } from './ExpRecognition';
import { ExpSimple } from './ExpSimple';

const testConfigMapper = (
	{ type, tries }: TestConfiguration, lastTest: boolean, onSaveTestScore: (data: SpecificScore) => void
) => {
	switch (type) {
	case 'simple':
		return <ExpSimple tries={tries} lastTest={lastTest} onSaveTestScore={onSaveTestScore} />
	case 'choice':
		return <ExpChoice tries={tries} lastTest={lastTest} onSaveTestScore={onSaveTestScore} />
	case 'discrimination':
		return <ExpDiscrimination tries={tries} lastTest={lastTest} onSaveTestScore={onSaveTestScore} />
	case 'recognition':
		return <ExpRecognition tries={tries} lastTest={lastTest} onSaveTestScore={onSaveTestScore} />
	}
}

const NotFound: React.FC = () => {
	const homePage = () => window.location.pathname = '/';
	return (
		<div className='notFoundContainer'>
			<img className='notFoundImage' src='./../404_v4.png' alt="Experiment not found" />
			<h1>Oooops,</h1>
			<h2>looks like you&apos;re looking for an unexisting test :(</h2>
			<button className='btn btn-primary rounded-pill px-5 mt-3 mb-3' onClick={homePage}>Home page</button>
		</div>
	)
}

const Expired: React.FC = () => {
	const homePage = () => window.location.pathname = '/';
	return (
		<div className='notFoundContainer'>
			<GiTimeBomb size='6rem' />
			<h1>Oooops,</h1>
			<h2>looks like the test you&apos;re looking for already expired :(</h2>
			<button className='btn btn-primary rounded-pill px-5 mt-3 mb-3' onClick={homePage}>Home page</button>
		</div>
	)
}

const UnknownError: React.FC<{ message: string }> = ({ message }) => {
	const homePage = () => window.location.pathname = '/';
	return (
		<div className='notFoundContainer'>
			<MdErrorOutline size='6rem' />
			<h1>Unknown error</h1>
			<p>{message}</p>
			<button className='btn btn-primary rounded-pill px-5 mt-3 mb-3' onClick={homePage}>Home page</button>
		</div>
	)
}

export const ExperimentPage: React.FC = () => {
	const { id } = useParams();
	const [experiment, setExperiment] = useState<Experiment>()
	const [errorMessage, setErrorMessage] = useState<JSX.Element>();

	useEffect(() => {
		loadExperiment();
	}, [])

	const loadExperiment = async () => {
		if (!id) return;
		const [data, status] = await getExperiment(id);
		if (data && status === 200) {
			setExperiment(data as Experiment);
		} else if (status === 404) {
			setErrorMessage(<NotFound />)
		} else if (status === 400) {
			setErrorMessage(<Expired />)
		} else {
			setErrorMessage(<UnknownError message={data as string} />)
		}
	}

	return (
		<div className="experiment">
			{!experiment && !errorMessage &&
				<div className="vh-100 flex-center-all">
					<PageSpinner />
				</div>
			}
			{experiment && <ExperimentInstance experiment={experiment} />}
			{errorMessage}
		</div>
	)
}

interface ExperimentProp {
	experiment: Experiment;
}

interface RequiredDataFormProps extends ExperimentProp {
	onSubmit: (...args: any[]) => void;
}

const ExperimentInstance: React.FC<ExperimentProp> = ({ experiment }: ExperimentProp) => {
	const { testsConfig } = experiment;

	const [requiredData, setRequiredData] = useState({});
	const [scores, setScores] = useState<SpecificScore[]>([])
	const [currentStage, setCurrentStage] = useState<number>(0);

	const handleRequiredDataSubmit = (data: any) => {
		setRequiredData(data);
		setCurrentStage(1);
	}

	const onSaveTestScore = (data: SpecificScore) => {
		setScores(old => old.concat([data]));
		setCurrentStage(old => old + 1);
	}

	return (
		<TransitionGroup className='min-vh-100'>
			<CSSTransition key={currentStage} timeout={500} classNames='item'>
				<div className='slide'>
					{currentStage === 0 &&
						<FirstSlide testsConfig={testsConfig} experiment={experiment} onSubmit={handleRequiredDataSubmit} />
					}

					{testsConfig.map((test, i) => {
						if (currentStage === i + 1) return (
							testConfigMapper(test, i === testsConfig.length - 1, onSaveTestScore)
						)
					}
					)}

					{currentStage === testsConfig.length + 1 &&
						
						<Results scores={scores} requiredData={requiredData} />
					}
				</div>
			</CSSTransition>
		</TransitionGroup>
	)
}

interface FirstSlideProps extends RequiredDataFormProps {
	testsConfig: TestConfiguration[];
}

const FirstSlide: React.FC<FirstSlideProps> = ({ testsConfig, ...props }) => {
	return (
		<div className="requiredDataForm">
			<div className='hero-auto pt-4 pb-4'>
				<h1 className='letterSpaced'>Welcome to <br className='display-to-sm' />Reacti<MdTimelapse size={'1.9rem'} />nMate</h1>
				{testsConfig.length > 1 ?
					<p className='text-sm'>
						You will be presented with <b>{testsConfig.length}</b> different tests
						<br/>
						Complete each of them and review your results
					</p>
					:
					<p className='text-sm'>
						You will be presented with one <b>{testsConfig[0].type}</b> type test
						<br/>
						Complete it and review your result
					</p>
				}
			</div>
			<div className='container'>
				<RequiredDataForm {...props} />
			</div>
		</div>
	)
}

const RequiredDataForm: React.FC<RequiredDataFormProps> = ({ experiment, onSubmit }: RequiredDataFormProps) => {
	const { requiredDataConfig } = experiment;

	const initRequiredData = () => {
		const data: Record<string, any> = {};
		requiredDataConfig?.length && requiredDataConfig.forEach(input => {
			if (input.type === 'radio' && input.options) {
				data[input.tableLabel] = input.options[0].value;
			}
		})

		return data;
	}

	const [requiredData, setRequiredData] = useState(initRequiredData);

	const handleDataChange = (e: any) => {
		const key = e.target.dataset.key;
		const value = e.target.value;

		setRequiredData(old => ({
			...old,
			[key]: value
		}))
	}

	return (
		<div className='pt-3 row flex-center-all'>
			<div className='col col-lg-6 col-md-8'>
				<div className='text-center'>
					<h2>Please provide us with next information<br className='display-to-sm'/> before starting</h2>
				</div>
				<br />
				<Form onSubmit={() => onSubmit(requiredData)}>
					<div className="form-group">
						<label htmlFor="firstName">First name:</label>
						<input
							type="text"
							className="form-control"
							id="firstName" data-key='firstName'
							onChange={handleDataChange}
							required
						/>
						<div className="invalid-feedback">
							Please enter your first name.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="lastName">Last name:</label>
						<input
							type="text"
							className="form-control"
							id="lastName" data-key='lastName'
							onChange={handleDataChange}
							required
						/>
						<div className="invalid-feedback">
							Please enter your last name.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="email">Email address:</label>
						<input
							type="email"
							className="form-control"
							id="email" data-key='email'
							placeholder={'name@example.com'}
							onChange={handleDataChange}
							required
						/>
						<div className="invalid-feedback">
							Please enter a valid email address.
						</div>
					</div>
					<CustomDataForm
						customDataForm={requiredDataConfig}
						currentState={requiredData}
						handleChange={handleDataChange}
					/>
					<button type='submit' className="btn btn-primary float-right px-4">Next</button>
				</Form>
			</div>
		</div>
	)
}

interface ResultsProps {
	scores: SpecificScore[];
	requiredData: Record<string, any>;
}

const Results: React.FC<ResultsProps> = ({ scores, requiredData }: ResultsProps) => {
	const { id } = useParams();
	const [sending, setSending] = useState(false);
	const [showModal, setShowModal] = useState(false)

	const submitResults = async () => {
		if (!id) return;

		setSending(true);
		const resp = await saveExperimentResult(id, scores, requiredData);
		const { status, ok, } = resp

		if (ok) {
			setShowModal(true);
		} else if (status === 404) {
			toast.error(await resp.text());
		} else {
			toast.warn(await resp.text());
		}

		setSending(false);
	}

	const homePage = () => window.location.pathname = '/';

	const takeAnother = () => window.location.reload();

	return (
		<div className="container resultsSlide">
			<ActivityFeedCard
				title='Results'
				scores={scores}
				showType
				showTries
				showDate={false}
				showAverage
				showBest
				showSuccess
			/>
			<button
				className='btn btn-primary rounded-pill px-5 mt-3 mb-3'
				onClick={submitResults}
				disabled={sending}
			>
				Submit results
			</button>

			{sending &&
				<div className="spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			}

			<Modal show={showModal} centered keyboard={false} backdrop='static'>
				<Modal.Header>
					<Modal.Title>Your results are submitted</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Thank you for taking our tests.<br />Feel free now to take another one or go to our home page.</p>
				</Modal.Body>
				<Modal.Footer>
					<button className='btn btn-secondary' onClick={takeAnother}>Take another</button>
					<button className='btn btn-primary' onClick={homePage}>Home page</button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}
