import React from 'react';
import { FaHome } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { Admin } from '../../model/User';
import { useStateWithStorage, dateDiffNow } from '../../utils';
import { initBlankAdmin } from './../../utils/inits';
import { NavButton } from './../Header';

export const AdminHeader: React.FC = () => {

	const [admin, setAdmin] = useStateWithStorage<Admin>('admin', false);

	const signout = () => {
		setAdmin(initBlankAdmin());
		window.location.reload();
	}

	return (
		<div className='header shadow'>
			<div className='container headerContent'>
				<div className='d-flex flex-row'>
					<NavButton to='/'><FaHome /> Home page</NavButton>
				</div>
				<div className='flex-center-all'>
					<h2><b>Admin panel • </b> {admin.name} // Joined {dateDiffNow(admin.created)} ago</h2>
				</div>
				<div className='d-flex flex-row'>
					<NavButton callback={signout}><RiLogoutBoxLine/> Sign out</NavButton>
				</div>
			</div>
		</div>
	)
}
