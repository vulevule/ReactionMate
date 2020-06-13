import React from 'react'
import { Playground } from '../dashboard/Playground'
import { ChoiceStartScreen, ChoiceStimulusScreen, ChoiceWaitScreen, arrowsMap } from '../dashboard/choice/Components'
import { ExperimentMode } from './../dashboard/Playground';

export const ExpChoice: React.FC<ExperimentMode> = (props: ExperimentMode) => {
	return (
		<Playground
			type='choice'
			startScreen={<ChoiceStartScreen />}
			stimulusScreen={<ChoiceStimulusScreen />}
			waitScreen={<ChoiceWaitScreen />}
			stimulusKeys={Object.keys(arrowsMap)}
			experimentMode={props}
		/>
            
	)
}
