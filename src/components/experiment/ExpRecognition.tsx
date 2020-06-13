import React from 'react'
import { Playground, ExperimentMode } from '../dashboard/Playground';
import { RecognitionStartScreen, RecognitionStimulusScreen } from '../dashboard/recognition/Components';

export const ExpRecognition: React.FC<ExperimentMode> = (props: ExperimentMode) => {
	return (
		<Playground
			type='recognition'
			startScreen={<RecognitionStartScreen />}
			stimulusScreen={<RecognitionStimulusScreen />}
			experimentMode={props}
		/>
	)
}
