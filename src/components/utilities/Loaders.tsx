import React from 'react';

interface SpinnerProps {
  small?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ small }) => (
  <div className={`spinner-border ${small ? 'spinner-border-sm' : ''}`} role="status">
    <span className="sr-only">Loading...</span>
  </div>
)

export const PageSpinner: React.FC = () => (
  <div className='spinner-border text-primary' role="status">
    <span className="sr-only">Loading...</span>
  </div>
)
