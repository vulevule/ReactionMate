import React from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaRegObjectUngroup } from 'react-icons/fa';
import { GiTrafficLightsGreen } from 'react-icons/gi';
import { RiLightbulbFlashLine } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import WelcomeBar from '../utilities/WelcomeBar';
import './dashboard.scss';
import './playground.scss';

export const Dashboard: React.FC = () => {

	const history = useHistory();

	const navigate = (to: string) => history.push(to);

	return (
		<div className='h-100'>
			<WelcomeBar />
			<div className='row mt-3'>
				<Card title='Simple' color='blue' image={<AiOutlineThunderbolt />} onClick={() => navigate('/simple')}>
					React to simple visual stimulus
				</Card>
				<Card title='Recognition' color='green' image={<GiTrafficLightsGreen />} onClick={() => navigate('/recognition')}>
					React only to specific visual stimulus
				</Card>
				<Card title='Choice' color='yellow' image={<RiLightbulbFlashLine />} onClick={() => navigate('/choice')}>
					React distinctively for each possible class of stimulus
				</Card>
				<Card title='Discrimination' color='red' image={<FaRegObjectUngroup />} onClick={() => navigate('/discrimination')}>
					Compare pairs of simultaneously presented stimuluses and react to one which stands out more
				</Card>
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
		<div className='col col-12 col-sm-6 col-xl-3 mb-4'>
			<div className={'cardContainer card text-center ' + (color ? 'border-' + color : '')} onClick={handleClick}>
				<div className={'imgContainer card-img-top text-' + color}>{image}</div>
				<div className='card-body'>
					<h5>{title}</h5>
					<p>{children}</p>
				</div>
			</div>
		</div>
	)
}
