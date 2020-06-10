
import React from 'react';
import { Playground } from '../Playground';
import { RecognitionStartScreen, RecognitionStimulusScreen } from './Components';

export const RecognitionRT: React.FC = () => {
    return (
        <div className='page'>
            <Playground
                type='recognition'
                startScreen={<RecognitionStartScreen />}
                stimulusScreen={<RecognitionStimulusScreen />}
            />
            <div className='pt-3'>

            </div>
        </div>
    )
}
