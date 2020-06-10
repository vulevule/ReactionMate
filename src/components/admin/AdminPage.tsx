import React from 'react';
import { Admin } from '../../model/User';
import { useStateWithStorage } from '../../utils/inits';
import './adminPanel.scss';
import { AdminLoginForm } from './AdminLoginForm';
import { AdminPanel } from './AdminPanel';

export const AdminPage: React.FC = () => {
  const [admin] = useStateWithStorage<Admin>('admin', false);

  return (
    <div className='panelWrapper'>
      {admin?.token ? <AdminPanel/> : <AdminLoginForm/>}
    </div>
  )
}
