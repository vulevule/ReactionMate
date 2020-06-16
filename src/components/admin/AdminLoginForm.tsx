import React, { useState } from 'react'
import './adminPanel.scss'
import { Admin } from '../../model/User';
import { useStateWithStorage } from '../../utils/inits';
import { toast } from 'react-toastify';
import { LoginForm } from '../login/Login';
import { login } from '../../services/userServices';
import { MdTimelapse } from 'react-icons/md';

export const AdminLoginForm: React.FC = () => {

	const [, setAdmin] = useStateWithStorage<Admin>('admin', false);

	const [userData, setUserData] = useState({
		username: '',
		password: '',
	});

	const handleChange = (e: any) => {
		setUserData({
			...userData,
			[e.target.dataset.key]: e.target.value
		})
	}

	const submit = async () => {
		const [data, status] = await login({ username: userData.username, password: userData.password }, true);
		if (data && status === 200) {
			setAdmin(data as Admin);
			window.location.reload();
		} else if (status === 404) {
			toast.error('User with given credentials not found');
		} else {
			toast.error(data)
		}
	}

	return (
		<div className='loginForm'>
			<div className='hero-auto pt-4 pb-4 text-center'>
				<h1 className='letterSpaced'>
					Welcome to <br className='display-to-sm' />Reacti<MdTimelapse size={'1.9rem'} />nMate
				</h1>
				<br />
				<h2>• Admin panel •</h2>
			</div>
			<br />
			<div className='row flex-center-all'>
				<div className='col col-sm-8 col-md-6'>
					<LoginForm onInputChange={handleChange} onSubmit={submit} />
				</div>
			</div>

		</div>
	)
}
