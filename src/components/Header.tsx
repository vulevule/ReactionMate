import React, { useState, useEffect, useRef } from 'react';
import { FaUserPlus, FaBars, FaUser } from 'react-icons/fa';
import { IoIosStats } from 'react-icons/io';
import { MdDashboard } from 'react-icons/md';
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useHistory, useLocation } from 'react-router-dom';
import { initGuestUser, useStateWithStorage, dateDiffNow } from './../utils';

const Header: React.FC = () => {

	const deviceSizeBreakpoint = 'lg'

	const [user, setUser] = useStateWithStorage('user');
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
	const history = useHistory();

	const signout = () => {
		setUser(initGuestUser());
		history.push('/');
	}

	const handleResize = () => {
		const { innerWidth: width } = window;
		setScreenWidth(width);
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [])

	return (
		<div style={{width: screenWidth}} className='header shadow'>
			<div className='container headerContent'>
				<div className={`display-from-${deviceSizeBreakpoint}`}>
					<div className='d-flex flex-row justify-content-center'>
						<NavButton to='/dashboard'><MdDashboard />&nbsp;Dashboard</NavButton>
						<NavButton to='/stats'><IoIosStats />&nbsp;Stats</NavButton>
					</div>
				</div>
				<div className={`display-to-${deviceSizeBreakpoint}`}>
					<HeaderDropdown icon={<FaBars />}>
						<NavButton to='/dashboard'><MdDashboard />&nbsp;Dashboard</NavButton>
						<NavButton to='/stats'><IoIosStats />&nbsp;Stats</NavButton>
					</HeaderDropdown>
				</div>

				<div className={`display-from-${deviceSizeBreakpoint}`}>
					<div className='flex-center-all'>
						<h2>{user.name} // Joined {dateDiffNow(user.created)} ago</h2>
					</div>
				</div>
				<div className={`display-to-${deviceSizeBreakpoint}`}>
					<div className='flex-center-all flex-column p-1'>
						<h2>{user.name}</h2>
						<small>Joined {dateDiffNow(user.created)} ago</small>
					</div>
				</div>

				<div className={`display-from-${deviceSizeBreakpoint}`}>
					<div className='d-flex flex-row justify-content-center'>
						{user.token ?
							<NavButton callback={signout}><RiLogoutBoxLine/>&nbsp;Sign out</NavButton>
							:
							<>
								<NavButton to='/signup'><FaUserPlus/>&nbsp;Sign up</NavButton>
								<NavButton to='/login'><RiLoginBoxLine/>&nbsp;Login</NavButton>
							</>}
					</div>
				</div>
				<div className={`display-to-${deviceSizeBreakpoint}`}>
					<HeaderDropdown icon={<FaUser/>}>
						{user.token ?
							<NavButton callback={signout}><RiLogoutBoxLine/>&nbsp;Sign out</NavButton>
							:
							<div className='d-flex flex-column'>
								<NavButton to='/signup'><FaUserPlus/>&nbsp;Sign up</NavButton>
								<NavButton to='/login'><RiLoginBoxLine/>&nbsp;Login</NavButton>
							</div>}
					</HeaderDropdown>
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

	const [active, setActive] = useState(false);
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		const sub = location.pathname.substr(1);
		to && to !== '/' && setActive(sub.startsWith(to.substr(1)));
	}, [location])

	const handleClick = () => {
		if (to) history.push(to);
		callback?.();
	}

	return (
		<span
			className={'headerButton ' + (active ? 'active' : '')}
			onClick={handleClick}
		>
			{children}
		</span>
	)
}

interface DropdownButtonProps {
	icon: React.ReactNode;
	children?: React.ReactNode;
}

export const HeaderDropdown: React.FC<DropdownButtonProps> = ({children, icon}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const closeDropdown = () => setShowDropdown(false);
	const [alignRight, setAlignRight] = useState(false);
	
	const ref = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		setShowDropdown(old => !old)
	}

	const determinePosition = () => {
		const { innerWidth: screenWidth } = window;
		const { right } = ref.current?.getBoundingClientRect() || {};
		if (right && right > screenWidth) {
			setAlignRight(true);
		}
	}

	useEffect(() => {
		determinePosition()
	}, [showDropdown])

	return (
		<div
			tabIndex={0}
			className='dropdown headerButton'
			onBlur={closeDropdown}
		>
			<span	onClick={handleClick}>
				{icon}
			</span>
			<div
				ref={ref}
				className={`dropdown-menu ${alignRight ? 'dropdown-menu-right' : ''} ${showDropdown ? 'show' : ''}`}
			>
				{React.Children.map(children, child => (
					<div className='d-flex' onClick={closeDropdown}>
						{child}
					</div>
				))}
			</div>
		</div>
	)
}

export default Header;
