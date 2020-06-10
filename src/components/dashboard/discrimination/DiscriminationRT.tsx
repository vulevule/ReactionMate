import React from 'react';
import { Playground } from '../Playground';
import { DiscriminationStartScreen, DiscriminationStimulusScreen, keyboardMap } from './Components';
import './discrimination.scss';

export const DiscriminationRT: React.FC = () => {

    return (
        <div className='page'>
            <Playground
                type='discrimination'
                startScreen={<DiscriminationStartScreen />}
                stimulusScreen={<DiscriminationStimulusScreen />}
                stimulusKeys={Object.keys(keyboardMap)}
            />
            <div className='pt-3'>

            </div>
        </div>
    )
}
