import React, { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../services';
import { validateInput } from '../../utils';
import { Form } from '../utilities/Forms';
import { User } from './../../model/User';
import { useStateWithStorage } from './../../utils/inits';
import './login.scss';

export const Login: React.FC = () => {

	const [user, setUser] = useStateWithStorage<User>('user');

	const [userData, setUserData] = useState({
		username: '',
		password: '',
	});

	const history = useHistory();

	useEffect(() => {
		if (user.token) {
			history.goBack();
		}
	}, [])

	const handleChange = (e: any) => {
		setUserData({
			...userData,
			[e.target.dataset.key]: e.target.value
		})
	}

	const submit = async () => {
		const [data, status] = await login({ username: userData.username, password: userData.password });
		if (data && status === 200) {
			setUser(data as User);
			window.location.pathname = '/stats';
		} else if (status === 404) {
			toast.error('User with given credentials not found');
		} else {
			toast.error(data)
		}
	}

	return (
		<div className='row d-flex justify-content-center'>
			<div className='col col-sm-8 col-md-6'>
				<div className='text-center'>
					<h1>Login</h1>
					<h2>Don&apos;t have an account? <Link to={'/signup'}>Sign up</Link></h2>
				</div>
				<br />
				<LoginForm onInputChange={handleChange} onSubmit={submit} />
				{/* <GoogleLoginBtn />
                <FBLoginBtn /> */}
			</div>
		</div>
	)
}

interface LoginFormProps {
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onInputChange, onSubmit }) => (
	<Form onSubmit={onSubmit}>
		<div className="form-group">
			<label htmlFor="username">Username:</label>
			<input
				type="text"
				className="form-control"
				id="username" data-key='username'
				onChange={onInputChange}
				onPaste={e => e.preventDefault()}
				onKeyPress={validateInput}
				required
			/>
			<div className="invalid-feedback">
                Please enter your username.
			</div>
		</div>
		<div className="form-group">
			<label htmlFor="password">Password:</label>
			<input
				type="password"
				className="form-control"
				id="password"
				data-key='password'
				onChange={onInputChange}
				onPaste={e => e.preventDefault()}
				onKeyPress={validateInput}
				required
				minLength={8}
			/>
			<div className="invalid-feedback">
                Please enter a valid 8-character password.
			</div>
		</div>

		<button type='submit' className="btn btn-primary float-right">Login</button>
	</Form>
)

function GoogleLoginBtn() {

	const responseGoogle = (response: any) => {
		console.log(response);
	}

	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_ID || ''}
			buttonText="Login with Google"
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={'single_host_origin'}
		/>
	)
}

function FBLoginBtn() {

	const responseFacebook = (response: any) => {
		console.log(response);
	}

	return (
		<FacebookLogin
			appId={process.env.REACT_APP_FACEBOOK_ID || ''}
			// autoLoad
			fields="name,email,picture"
			callback={responseFacebook}
			onFailure={responseFacebook}
			icon='fa-facebook'
			// cssClass='fbLogin'
		/>
	)
}
