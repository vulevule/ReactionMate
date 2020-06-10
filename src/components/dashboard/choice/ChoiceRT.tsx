
import React from 'react'
import { Playground } from '../Playground'
import './choice.scss'
import { arrowsMap, ChoiceStartScreen, ChoiceStimulusScreen, ChoiceWaitScreen } from './Components'


export const ChoiceRT: React.FC = () => {

    return (
        <div className='page'>
            <Playground
                type='choice'
                startScreen={<ChoiceStartScreen />}
                stimulusScreen={<ChoiceStimulusScreen />}
                waitScreen={<ChoiceWaitScreen />}
                stimulusKeys={Object.keys(arrowsMap)}
            />
            <div className='pt-3'>

            </div>
        </div>
    )
}
