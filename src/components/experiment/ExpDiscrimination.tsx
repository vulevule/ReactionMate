import React from 'react';
import { Playground, ExperimentMode } from '../dashboard/Playground';
import { DiscriminationStartScreen, DiscriminationStimulusScreen, keyboardMap } from '../dashboard/discrimination/Components';

export const ExpDiscrimination: React.FC<ExperimentMode> = (props: ExperimentMode) => {
    return (
        <Playground
            type='discrimination'
            startScreen={<DiscriminationStartScreen />}
            stimulusScreen={<DiscriminationStimulusScreen />}
            stimulusKeys={Object.keys(keyboardMap)}
            experimentMode={props}
        />
    )
}
