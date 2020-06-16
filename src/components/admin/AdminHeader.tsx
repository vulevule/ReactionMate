import React from 'react';
import { FaHome } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { Admin } from '../../model/User';
import { useStateWithStorage, dateDiffNow } from '../../utils';
import { initBlankAdmin } from './../../utils/inits';
import { NavButton } from './../Header';

export const AdminHeader: React.FC = () => {

	const deviceSizeBreakpoint = 'md'

	const [admin, setAdmin] = useStateWithStorage<Admin>('admin', false);

	const signout = () => {
		setAdmin(initBlankAdmin());
		window.location.reload();
	}

	return (
		<div className='header shadow'>
			<div className='container headerContent'>
				<div className='d-flex flex-row'>
					<NavButton to='/'>
						<div className={`display-from-${deviceSizeBreakpoint} align-items-center`}>
							<FaHome />&nbsp;Home page
						</div>
						<div className={`display-to-${deviceSizeBreakpoint}`}>
							<FaHome />
						</div>
						
					</NavButton>
				</div>
				<div className={`display-from-${deviceSizeBreakpoint}`}>
					<div className='flex-center-all'>
						<h2><b>Admin panel • </b> {admin.name} // Joined {dateDiffNow(admin.created)} ago</h2>
					</div>
				</div>
				<div className={`display-to-${deviceSizeBreakpoint}`}>
					<div className='flex-center-all flex-column p-1'>
						<h2><b>Admin panel • </b> {admin.name}</h2>
						<small>Joined {dateDiffNow(admin.created)} ago</small>
					</div>
				</div>
				
				<div className='d-flex flex-row'>
					<NavButton callback={signout}>
						<div className={`display-from-${deviceSizeBreakpoint} align-items-center`}>
							<RiLogoutBoxLine />&nbsp;Sign out
						</div>
						<div className={`display-to-${deviceSizeBreakpoint}`}>
							<RiLogoutBoxLine />
						</div>
					</NavButton>
				</div>
			</div>
		</div>
	)
}
