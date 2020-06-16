import React from 'react';
import { MdTimelapse } from 'react-icons/md'

const WelcomeBar: React.FC = () => {
	return (
		<div className='hero-auto pt-5 pb-5'>
			<h1 className='letterSpaced'>Welcome to <br className='display-to-sm' />Reacti<MdTimelapse size={'1.9rem'} />nMate</h1>
			<h4 className='text-center display-from-sm'>
				Measure your reaction time <br className='display-to-lg' />with 4 interactive cognitive games
			</h4>
			<h6 className='text-center display-to-sm'>
				Measure your reaction time <br className='display-to-md' />with 4 interactive cognitive games
			</h6>
		</div>
	)
}

export default WelcomeBar;
