
import React from 'react';
import { Playground } from '../Playground';
import { SimpleStartScreen, SimpleStimulusScreen } from './Components';

export const SimpleRT: React.FC = () => {

	return (
		<div className='page'>
			<Playground
				type='simple'
				staticStimulusContent
				startScreen={<SimpleStartScreen />}
				stimulusScreen={<SimpleStimulusScreen />}
			/>
			<div className='pt-3'>

			</div>
		</div>		
	)
}
