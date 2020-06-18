import React from 'react';
import { Playground, ExperimentMode } from '../dashboard/Playground';
import { SimpleStartScreen, SimpleStimulusScreen } from '../dashboard/simple/Components';

export const ExpSimple: React.FC<ExperimentMode> = (props: ExperimentMode) => {
	return (
		<Playground
			type='simple'
			staticStimulusContent
			startScreen={<SimpleStartScreen />}
			stimulusScreen={<SimpleStimulusScreen/>}
			experimentMode={props}
		/>
	)
}
