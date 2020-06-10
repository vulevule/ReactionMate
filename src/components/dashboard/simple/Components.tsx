import React from 'react'

export const SimpleStartScreen: React.FC = () => {
  return (
      <>
          <h1>Test your <br className='display-to-sm' />reaction time</h1>
          <br />
          <h2>When this blue box turns green, <br className='display-to-md' />click anywhere as quickly as you can.</h2>
          <h2>You can also use space / enter buttons.</h2>
          <br />
          <h4>Click anywhere to start</h4>
      </>
  )
}

export const SimpleStimulusScreen: React.FC = () => {
  return (
      <>
          <h1 className='font-weight-bold'>Click!</h1>
      </>
  )
}
