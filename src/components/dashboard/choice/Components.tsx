import React, { useEffect, useRef, useState } from 'react'
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa'
import { ScreenProps } from '../Playground'
import './choice.scss'

export const arrowsMap: { [key: string]: JSX.Element } = {
  ArrowUp: <FaArrowUp />,
  ArrowRight: <FaArrowRight />,
  ArrowDown: <FaArrowDown />,
  ArrowLeft: <FaArrowLeft />
}

export const ChoiceStartScreen: React.FC = () => {
  return (
      <>
          <div className='flex-center-column-fullheight'>
              <h1>Test your choice <br className='display-to-sm' />reaction time</h1>
              <br />
              <h2>You will be presented with one out of 4 different types of stimulus - 4 arrows</h2>
              <h2>Click on the correct button bellow as quickly as you can</h2>
              <h2>You can also use <FaArrowUp /> <FaArrowRight /> <FaArrowDown /> <FaArrowLeft /> keyboard buttons</h2>

              <br />
              <h4>Click anywhere to start</h4>
          </div>
          <ArrowDeck />
      </>
  )
}

export const ChoiceStimulusScreen: React.FC<ScreenProps> = ({ onClick, onRightClick, onKeyDown }) => {

  const displayed = useRef<string>();
  const [displayedHelper, setDisplayedHelper] = useState(displayed.current)

  useEffect(() => {
      initStimulus();

      if (onKeyDown) {
          window.addEventListener('keydown', handleKeyPress)
          return () => {
              window.removeEventListener('keydown', handleKeyPress)
          }
      }
  }, [])



  const handleRightClick = (e: any) => {
      e.preventDefault();
      onRightClick?.();
  }

  const handleKeyPress = (e: any) => {
      onKeyDown?.(e, displayed.current === e.key);
  }

  const handleClick = (arrow: string) => {
      onClick?.(arrow === displayed.current);
  }

  const initStimulus = () => {
      const keys = Object.keys(arrowsMap);
      const idx = Math.floor(Math.random() * keys.length)
      const arrow = keys[idx];
      displayed.current = arrow;
      setDisplayedHelper(arrow)
  }

  return (
      <div className='playground' onContextMenu={handleRightClick}>
          <span className='displayed'>{displayedHelper && arrowsMap[displayedHelper]}</span>
          <ArrowDeck onClick={handleClick} />
      </div>
  )
}

export const ChoiceWaitScreen: React.FC = () => {
  return (
      <>
          <h1 className='flex-center-column-fullheight'>Wait for it...</h1>
          <ArrowDeck />
      </>
  )
}

const ArrowDeck: React.FC<{ onClick?: (arrow: string) => void }> = ({ onClick }) => {

  return (
      <div className='resp-width-wider row'>
          {Object.keys(arrowsMap).map((e, i) =>
              <div key={i} className='col col-6 col-sm-3 mb-3'>
                  <div className='arrowCard rounded' onClick={() => onClick?.(e)}>
                      {arrowsMap[e]}
                  </div>
              </div>
          )}
      </div>
  )
}
