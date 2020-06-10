import React from 'react';
import { FaUserPlus } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { initGuestUser, useStateWithStorage, dateDiffNow } from './../utils';

const Header: React.FC = () => {

	const [user, setState] = useStateWithStorage('user');

	const signout = () => {
		setState(initGuestUser());
		window.location.pathname = '/';
	}

	return (
		<div className='header shadow'>
			<div className='container headerContent'>
				<div className='d-flex flex-row'>
					<NavButton to='/dashboard'><MdDashboard /> Dashboard</NavButton>
					<NavButton to='/stats'><IoIosStats /> Stats</NavButton>
				</div>
				<div className='flex-center-all'>
					<h2>{user.name} // Joined {dateDiffNow(user.created)} ago</h2>
				</div>
				<div className='d-flex flex-row'>
					{user.token ?
						<NavButton callback={signout}><RiLogoutBoxLine/> Sign out</NavButton>
						:
						<>
							<NavButton to='/signup'><FaUserPlus/> Sign up</NavButton>
							<NavButton to='/login'><RiLoginBoxLine/> Login</NavButton>
						</>}

				</div>
			</div>
		</div>
	)

}

interface NavButtonProps {
	to?: string;
	callback?: Function;
}

export const NavButton: React.FC<NavButtonProps> = ({ to, callback, children }) => {

	const history = useHistory();

	const handleClick = () => {
		if (to) history.push(to);
		callback?.();
	}

	const isActive = () => {
		if (!to || to.length <= 1) return false;

		const sub = history.location.pathname.substr(1);
		return sub.startsWith(to.substr(1));
	};

	return (
		<span
			className={'headerButton ' + (isActive() ? 'active' : '')}
			onClick={handleClick}
		>
			{children}
		</span>
	)
}

export default Header;
