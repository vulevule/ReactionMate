import React, { useRef, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaRegObjectUngroup } from 'react-icons/fa';
import { GiTrafficLightsGreen } from 'react-icons/gi';
import { RiLightbulbFlashLine } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import { animated, useChain, useSpring, useTransition } from 'react-spring';
import WelcomeBar from '../utilities/WelcomeBar';
import './dashboard.scss';
import './playground.scss';

// const config = { mass: 5, tension: 2000, friction: 200 }

export const Dashboard: React.FC = () => {

	const history = useHistory();
	const navigate = (to: string) => {
		setOpen(false);
		setTimeout(() => history.push(to), 1000)	
	};

	const data: JSX.Element[] = [
		<Card key={0} title='Simple' color='blue' image={<AiOutlineThunderbolt />} onClick={() => navigate('/simple')}>
			React to simple visual stimulus
		</Card>,
		<Card key={1} title='Recognition' color='green' image={<GiTrafficLightsGreen />} onClick={() => navigate('/recognition')}>
			React only to specific visual stimulus
		</Card>,
		<Card key={2} title='Choice' color='yellow' image={<RiLightbulbFlashLine />} onClick={() => navigate('/choice')}>
			React distinctively for each possible class of stimulus
		</Card>,
		<Card key={3} title='Discrimination' color='red' image={<FaRegObjectUngroup />} onClick={() => navigate('/discrimination')}>
			Compare pairs of simultaneously presented stimuluses and react to one which stands out more
		</Card>
	];

	const [open, setOpen] = useState(true);

	const springRef = useRef(null)
	const spring = useSpring({
		ref: springRef,
		opacity: open ? 1 : 0,
		from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
		transform: `translate3d(${open ? '0%' : '100%'},0,0)`,
	})
	
	const transRef = useRef(null)
	const transitions = useTransition(open ? data : [], (item: JSX.Element) => item.props.title, {
		ref: transRef,
		unique: true,
		trail: 400 / data.length,
		from: { opacity: 0, transform: 'scale(0)' },
		enter: { opacity: 1, transform: 'scale(1)' },
		leave: { opacity: 0, transform: 'scale(0)' },
	})

	useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])

	return (
		<div className='page-min-height'>
			<animated.div style={spring}>
				<WelcomeBar />
			</animated.div>
			<div className='row mt-3'>
				{transitions.map(({ item, props, key }) => (
					<animated.div
						key={key}
						style={props}
						className='col col-12 col-sm-6 col-xl-3 mb-4'
					>
						{item}
					</animated.div>
				))}
			</div>
		</div>
	)
}

interface CardProps {
	title?: string;
	image?: JSX.Element;
	color?: string;
	onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, image, color, onClick, children }) => {

	const handleClick = () => {
		onClick?.()
	}

	return (
		// <div className='col col-12 col-sm-6 col-xl-3 mb-4'>
		<div className={'cardContainer card text-center ' + (color ? 'border-' + color : '')} onClick={handleClick}>
			<div className={'imgContainer card-img-top text-' + color}>{image}</div>
			<div className='card-body'>
				<h5>{title}</h5>
				<p>{children}</p>
			</div>
		</div>
		// </div>
	)
}
