import React, { useState } from 'react';
import CountUp from 'react-countup';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReactionTimeType } from '../../model/Types';
import { average, countDecimals, dateDiffNow } from '../../utils';
import { SpecificScores, User } from './../../model/User';
import { useStateWithStorage } from './../../utils/inits';
import { formatDate } from './../../utils/other';
import './stats.scss';
import { DropdownButton, Dropdown } from 'react-bootstrap';

export const Stats: React.FC = () => {

	const { path, url } = useRouteMatch();
	const tabs: ReactionTimeType[] = ['simple', 'recognition', 'choice', 'discrimination']

	const getInitSelected = () => (
		tabs.find(e => window.location.pathname.endsWith(e)) || tabs[0]
	)

	const [selected, setSelected] = useState(getInitSelected());
	const [lastSelected, setLastSelected] = useState('simple')
	const [tabsFirstSelect, setTabsFirstSelect] = useState({
		simple: true,
		recognition: true,
		choice: true,
		discrimination: true
	})

	const selectTab = (tab: ReactionTimeType) => {
		setSelected(tab);
		setTabsFirstSelect(old => ({ ...old, [lastSelected]: false }));
		setLastSelected(tab);
	}

	return (
		<div className='h-100'>
			<div className='mt-1'>
				<ul className="display-from-sm nav nav-tabs nav-justified">
					{tabs.map((tab, i) =>
						<li key={i} className="nav-item">
							<Link
								className={'nav-link text-capitalize ' + (selected === tab ? 'active' : '')}
								onClick={() => selectTab(tab)}
								to={`${url}/${tab}`}
							>
								{tab}
							</Link>
						</li>
					)}
				</ul>
				<div className="display-to-sm justify-content-center">
					<DropdownButton
						id="dropdown-item-button"
						title={<span className='text-capitalize'>{selected}</span>}
						variant='link'
					>
						{tabs.map((tab, i) =>
							<Dropdown.Item
								key={i}
								as="button"
								active={selected === tab}
							>
								<Link
									className={'text-capitalize ' + (selected === tab ? 'text-white' : '')}
									onClick={() => selectTab(tab)}
									to={`${url}/${tab}`}
								>
									{tab}
								</Link>
							</Dropdown.Item>
						)}
					</DropdownButton>
				</div>
			</div>

			<Switch>
				<Route exact path={path}>
					<ReactionTypeStats type='simple' firstSelect={tabsFirstSelect.simple} />
				</Route>
				<Route path={`${path}/simple`}>
					<ReactionTypeStats type='simple' firstSelect={tabsFirstSelect.simple} />
				</Route>
				<Route path={`${path}/recognition`}>
					<ReactionTypeStats type='recognition' firstSelect={tabsFirstSelect.recognition} />
				</Route>
				<Route path={`${path}/choice`}>
					<ReactionTypeStats type='choice' firstSelect={tabsFirstSelect.choice} />
				</Route>
				<Route path={`${path}/discrimination`}>
					<ReactionTypeStats type='discrimination' firstSelect={tabsFirstSelect.discrimination} />
				</Route>
			</Switch>
		</div>
	)
}

interface ReactionTimeStatsProps {
	type: ReactionTimeType;
	firstSelect?: boolean;
	showAverage?: boolean;
	showBest?: boolean;
	showSuccess?: boolean;
}

interface SpecificScoreProps extends ReactionTimeStatsProps {
    scores: SpecificScores;
}

const ReactionTypeStats: React.FC<ReactionTimeStatsProps> = ({ type, showAverage = true, showBest = true, showSuccess = true, firstSelect }) => {

	const [user] = useStateWithStorage<User>('user');
	const averages = user.scores[type].map(s => s.average);
	const bests = user.scores[type].map(s => s.best);
	const successes = user.scores[type].map(s => s.success || 0);

	const averageScore = averages?.length ? average(averages) : 0;
	const bestScore = bests?.length ? Math.min(...bests) : 0;
	const successScore = successes?.length ? average(successes) : 0;

	return (
		<div className='mt-3 text-center'>
			{!averages.length ?
				<div className='mt-5'>
					<h4>There are still no results in this category</h4>
					<h6><Link to={'/' + type}>Take the test</Link>, and make some great stats!</h6>
				</div>
				:
				<>
					<div className='card-deck mb-3'>
						{showAverage && <AverageScoreCard score={averageScore} firstSelect={firstSelect} />}
						{showBest && <BestScoreCard score={bestScore} firstSelect={firstSelect} />}
						{showSuccess && <SuccessScoreCard score={successScore} firstSelect={firstSelect} />}
					</div>
					<p className='msg'>You can do it better, right? <Link to={'/' + type}>Take the test</Link>, and improve your results!</p>
					<RecentResultsCard
						type={type}
						showAverage={showAverage}
						showBest={showBest}
						showSuccess={showSuccess}
						scores={user.scores[type]}
						firstSelect={firstSelect}
					/>
					<ActivityFeedCard
						showAverage={showAverage}
						showBest={showBest}
						showSuccess={showSuccess}
						scores={user.scores[type]}
					/>
				</>}
		</div>
	)
}

interface ActivityFeedCardProps extends Partial<SpecificScoreProps> {
	showType?: boolean;
	showDate?: boolean;
	showTries?: boolean;
	title?: string;
}

export const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({ title, scores, showType, showAverage, showBest, showSuccess, showDate = true, showTries }) => {

	const deviceSizeBreakpoint = 'md'

	return (
		<div className='w-100 card shadow-sm mb-3'>
			<div className='card-body text-center'>
				<h5 className='card-title'>{title || 'Activity feed'}</h5>
				<div className='card-text'>
					{scores?.length ?
						<div>
							<div className='table-responsive'>
								<table className='table table-sm mb-3 statsTable'>
									<thead><tr>
										{showType && <th scope="col" className='typeColumn'>Test</th>}
										{showTries && <th scope="col">Tries</th>}
										{showDate && <th scope="col" className='dateColumn'>Date</th>}
										{showAverage && <th scope="col">Average</th>}
										{showBest && <th scope="col">Best</th>}
										{showSuccess && <th scope="col">Success</th>}
									</tr></thead>
									<tbody>
										{scores?.map((s, i) =>
											<tr key={i}>
												{showType &&  <td className='text-capitalize'>{s.type[0]}</td>}
												{showTries && <td>{s.tries}</td>}
												{showDate && <td >
													{dateDiffNow(s.date)} ago <br className={`display-to-${deviceSizeBreakpoint}`} />
													<span className='dateText'>
														• {formatDate(s.date, 'custom')} •
													</span>
												</td>}
												{showAverage && <td>{s.average}ms</td>}
												{showBest && <td>{s.best}ms</td>}
												{showSuccess && <td>{s.success}%</td>}
											</tr>
										)}
									</tbody>
								</table>
							</div>
							{showType && <div className='pt-3'>
								<small className='text-muted w-100'>
									S - Simple, C - Choice, <br className={`display-to-${deviceSizeBreakpoint}`} />R - Recognition, D - Discrimination
								</small>
							</div>}
						</div>
						
						: <span className='averageScoreText'>N/A</span>}
				</div>
			</div>
		</div>
	)
}

const RecentResultsCard: React.FC<SpecificScoreProps> = ({ scores, showAverage, showBest, firstSelect }) => {
	const [showAverageOnChart, setShowAverageOnChart] = useState(showAverage);
	const [showBestOnChart, setShowBestOnChart] = useState(showBest)

	const data = scores.map(s => {
		const d = new Date(s.date);
		const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		return { ...s, date: `${da}-${mo}` }
	});

	return (
		<div className='card shadow-sm mb-3'>
			<div className='card-body'>
				<h5 className='card-title'>Recent results</h5>
				<div className='card-text'>
					<ResponsiveContainer width='95%' height={300}>
						<LineChart data={data}>
							{showAverageOnChart &&
								<Line type="monotone" dataKey="average" stroke="#8884d8" isAnimationActive={firstSelect} />
							}
							{showBestOnChart &&
								<Line type="monotone" dataKey="best" stroke="#82ca9d" isAnimationActive={firstSelect} />
							}
							<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
							<XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
							<YAxis />
							<Tooltip />
							<Legend />
							{data.length > 5 && <Brush />}
						</LineChart>
					</ResponsiveContainer>
					<div className='chartSwitches'>
						{showAverage && <div className="custom-control custom-switch m-1">
							<input
								type="checkbox"
								className="custom-control-input"
								id="averageSwitch"
								checked={showAverageOnChart}
								onChange={() => setShowAverageOnChart(old => !old)}
							/>
							<label className="custom-control-label" htmlFor="averageSwitch">Average</label>
						</div>}
						{showBest && <div className="custom-control custom-switch m-1">
							<input
								type="checkbox"
								className="custom-control-input"
								id="bestSwitch"
								checked={showBestOnChart}
								onChange={() => setShowBestOnChart(old => !old)}
							/>
							<label className="custom-control-label" htmlFor="bestSwitch">Best</label>
						</div>}
					</div>
				</div>
			</div>
		</div>
	)
}

interface ScoreProp {
    score: number;
    firstSelect?: boolean;
}

interface SingleScoreProps extends ScoreProp {
    title: string;
    unit?: string;
}

const AverageScoreCard: React.FC<ScoreProp> = props => {
	return <SingleScoreCard title='Average score' {...props} />
}

const BestScoreCard: React.FC<ScoreProp> = props => {
	return <SingleScoreCard title='Best score' {...props} />
}

const SuccessScoreCard: React.FC<ScoreProp> = props => {
	return <SingleScoreCard title='Success score' {...props} unit='%' />
}

const SingleScoreCard: React.FC<SingleScoreProps> = ({ score, title, firstSelect, unit = 'ms' }) => {
	const decimals = countDecimals(score);

	return (
		<div className='card shadow-sm'>
			<div className='card-body text-center'>
				<h5 className='card-title'>{title}</h5>
				<span className='card-text averageScoreText'>
					{/* {firstSelect ? <CountUp end={score} delay={1} decimals={decimals} redraw /> : score} */}
					<CountUp start={firstSelect ? 0 : score} end={score} delay={1} decimals={decimals} />
				</span>
				{!!score && <cite>{unit}</cite>}
			</div>
		</div>
	)
}
