import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../../services';
import { Form } from '../utilities/Forms';
import { User } from './../../model/User';
import { useStateWithStorage } from './../../utils/inits';
import './signup.scss';

const initUserData = () => (
	{
		username: '',
		name: '',
		email: '',
		password: '',
		repeatPassword: '',
	}
)

export const Signup: React.FC = () => {

	const [user, setUser] = useStateWithStorage<User>('user');

	const [userData, setUserData] = useState(initUserData());
	const [showRepeatPass, setShowRepeatPass] = useState(false);

	const history = useHistory();

	useEffect(() => {
		if (user.token) {
			history.goBack();
		}
	}, [])

	const handleUserDataChange = (e: any) => {

		const key = e.target.dataset.key;
		const value = e.target.value;

		if (key === 'repeatPassword') {
			if (userData.password === value) {
				setShowRepeatPass(false);
			} else {
				setShowRepeatPass(true);
			}
		}

		setUserData(old => ({
			...old,
			[key]: value
		}))
	}

	const passwordsMatch = () => {
		const { password, repeatPassword } = userData;

		if (password.trim().length && repeatPassword.trim().length) {
			return password === repeatPassword
		}

		return false
	}

	const submit = async () => {

		if (!passwordsMatch()) return

		const signupData = {
			username: userData.username,
			password: userData.password,
			name: userData.name,
			email: userData.email,
		}
		const [data, status] = await signup(signupData)
		if (data && status === 200) {
			setUser(data as User);
			window.location.pathname = '/stats';
		} else if (status === 406) {
			toast.error('Given username is already in use');
		} else {
			toast.error(data)
		}
	}

	return (
		<div className='row flex-center-all'>
			<div className='col col-sm-8 col-md-6'>
				<div className='text-center'>
					<h1>Sign up</h1>
					<h2>Already have an account? <Link to={'/login'}>Log in</Link></h2>
				</div>
				<br />
				<Form onSubmit={submit}>
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							className="form-control"
							id="username" data-key='username'
							// onPaste={e => e.preventDefault()}
							// onKeyPress={validateInput}
							onChange={handleUserDataChange}
							required
						/>
						<div className="invalid-feedback">
                            Please choose an username.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="name">Display name:</label>
						<input
							type="text"
							className="form-control"
							id="name" data-key='name'
							// onPaste={e => e.preventDefault()}
							// onKeyPress={validateInput}
							onChange={handleUserDataChange}
							required
						/>
						<div className="invalid-feedback">
                            Please choose a display name.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="email">Email address:</label>
						<input
							type="email"
							className="form-control"
							id="email" data-key='email'
							placeholder={'name@example.com'}
							// onPaste={e => e.preventDefault()}
							// onKeyPress={validateInput}
							onChange={handleUserDataChange}
							required
						/>
						<div className="invalid-feedback">
                            Please enter a valid email address.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							className="form-control"
							id="password" data-key='password'
							placeholder='Minimum 8 characters'
							onPaste={e => e.preventDefault()}
							// onKeyPress={validateInput}
							onChange={handleUserDataChange}
							required
							minLength={8}
						/>
						<div className="invalid-feedback">
                            Please chose an 8-character password.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="repeat-password">Repeat password:</label>
						<input
							type="password"
							className="form-control"
							id="repeat-password"
							data-key='repeatPassword'
							onPaste={e => e.preventDefault()}
							// onKeyPress={validateInput}
							onChange={handleUserDataChange}
							required
							minLength={8}
						/>
						<div className="invalid-feedback">
                            Please repeat the password.
						</div>
						{showRepeatPass && <small id="match" className={'form-text text-danger'}>Passwords don&apos;t match.</small>}
					</div>

					<button type='submit' className="btn btn-primary float-right">Submit</button>
				</Form>

			</div>

		</div>
	)
}
