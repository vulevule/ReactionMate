import { User, Admin } from './../model/User';

const api = process.env.REACT_APP_API_URL

interface LoginData {
    username: string;
    password: string;
}

interface SignUpData {
    username: string;
    password: string;
    name: string;
    email: string;
}

export const login = async (credentials: LoginData, admin = false) => {
	const url = admin ? `${api}/adminLogin` : `${api}/login`;
	const { username, password } = credentials;
	const loggedUser = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.json();
			const { token, user: { created, ...props } } = data;
			const user: (User | Admin) = {
				token,
				created: new Date(created),
				...props,
			}
			return [user, resp.status];
		} else {
			const data = await resp.text();
			return [data, resp.status];
		}
	})

	return loggedUser
}

export const signup = async (credentials: SignUpData) => {
	const { username, password, email, name } = credentials
	const loggedUser = await fetch(`${api}/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password,
			name,
			email,
		})
	}).then(async resp => {
		if (resp.ok) {
			const data = await resp.json();
			const { token, user: { created, ...props } } = data;
			const user: User = {
				token,
				created: new Date(created),
				...props,
			}
			return [user, resp.status];
		} else {
			const data = await resp.text();
			return [data, resp.status];
		}
	})

	return loggedUser;
}
