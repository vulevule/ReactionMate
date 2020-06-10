import React, { useEffect, useRef, useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { ScreenProps } from '../Playground';
import { colors, getRandomArrayElement, getRandomProperty, setIntervalImmediately } from './../../../utils';
import { Circle, Pill, Rectangle, Square, Triangle } from './../../utilities/Shapes';

type ShapeMap = { [key: string]: JSX.Element };

const shapeMap: ShapeMap = {
    square: <Square size={110}/>,
    rectangleH: <Rectangle width={220} height={100}/>,
    rectangleV: <Rectangle width={120} height={200}/>,
    circle: <Circle size={130}/>,
    pillH: <Pill width={200} height={120}/>,
    pillV: <Pill width={100} height={220}/>,
    triangle: <Triangle size={100}/>
}

export const RecognitionStimulusScreen: React.FC<ScreenProps> = ({ onClick, onRightClick, onKeyDown, updateParentState }) => {

  const WINNING_SHAPE = 'circle';
  const STIMULUS_TIMEOUT = 1000;

  const displayedColor = useRef<string>();
  const displayedShapeName = useRef<string>();
  const [displayedShape, setDisplayedShape] = useState<JSX.Element>()

  const stimulusInterval = useRef(0)

  useEffect(() => {
      stimulusInterval.current = setIntervalImmediately(resetStimulus, STIMULUS_TIMEOUT)
      return () => {
          clearInterval(stimulusInterval.current)
      }
  }, [])

  useEffect(() => {
      if (onKeyDown) {
          window.addEventListener('keydown', handleKeyPress)
          return () => {
              window.removeEventListener('keydown', handleKeyPress)
          }
      }
  }, [])

  const handleKeyPress = (e: any) => {
      onKeyDown?.(e, displayedShapeName.current === WINNING_SHAPE);
  }

  const handleRightClick = (e: any) => {
      e.preventDefault();
      onRightClick?.();
  }

  const handleClick = () => {
      onClick?.(displayedShapeName.current === WINNING_SHAPE)
  }

  const resetStimulus = () => {
      const newColor = getRandomArrayElement(colors);
      const [shapeName, shape] = getRandomProperty<JSX.Element>(shapeMap)

      displayedColor.current = newColor;
      displayedShapeName.current = shapeName;
      setDisplayedShape(shape);

      if (shapeName === WINNING_SHAPE) {
          clearInterval(stimulusInterval.current)
      }

      updateParentState!({ stimulusColor: newColor, time: 0 })
  }

  return (
      <div className='playground pointer' onClick={handleClick} onContextMenu={handleRightClick}>
          <h1 className='h-100 flex-center-all'>{displayedShape}</h1>
      </div>
  )
}

export const RecognitionStartScreen: React.FC = () => {
  return (
      <>
          <h1>Test your recognition <br className='display-to-sm' />reaction time</h1>
          <br />
          <h2>When on this box appears <b>circle (<GoPrimitiveDot size='2rem'/>)</b>, <br className='display-to-md' />click anywhere as quickly as you can.</h2>
          <h2>Remember, react only on <b>CIRCLE</b>, <br className='display-to-md' />ignore other shapes.</h2>
          <h2>You can also use space / enter buttons.</h2>
          <br />
          <h4>Click anywhere to start</h4>
      </>
  )
}
