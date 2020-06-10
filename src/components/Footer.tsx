import React from 'react';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';

const Footer: React.FC = () => {

  return (
    <div className='hero-auto pt-5 pb-5'>
      <h6>Made with <span role='img' aria-label='heart'>❤️</span> in Novi Sad, Serbia</h6>
      <div>
        <a href='https://github.com/vulevule' className='iconLink'><AiFillGithub size={'2rem'} /></a>
        &nbsp;
        <a href='https://www.linkedin.com/in/vukasinjankovic/' className='iconLink'><AiFillLinkedin size={'2rem'} /></a>
      </div>

    </div>
  )
}

export default Footer;
