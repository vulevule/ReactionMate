import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import { AdminPage } from './components/admin/AdminPage';
import { ChoiceRT } from './components/dashboard/choice/ChoiceRT';
import { Dashboard } from './components/dashboard/Dashboard';
import { DiscriminationRT } from './components/dashboard/discrimination/DiscriminationRT';
import { RecognitionRT } from './components/dashboard/recognition/RecognitionRT';
import { SimpleRT } from './components/dashboard/simple/SimpleRT';
import { ExperimentPage } from './components/experiment/ExperimentPage';
import Footer from './components/Footer';
import Header from './components/Header';
import { Login } from './components/login/Login';
import { Signup } from './components/signup/Signup';
import { Stats } from './components/stats/Stats';
import { initConfig } from './utils';

toast.configure()

function App() {
	initConfig();
	return (
		<div className='container'>
			<Switch>
				<Route exact path='/test/:id'>
					<ExperimentPage />
				</Route>
				<Route path='/admin'>
					<AdminPage />
					<Footer />
				</Route>
				<Route path='/'>
					<Header />
					<div className='pt-3 content'>
						<Switch>
							<Route path='/dashboard'>
								<Dashboard />
							</Route>
							<Route path='/stats'>
								<Stats />
							</Route>
							<Route path='/login'>
								<Login />
							</Route>
							<Route path='/signup'>
								<Signup />
							</Route>
							<Route path='/simple'>
								<SimpleRT />
							</Route>
							<Route path='/recognition'>
								<RecognitionRT />
							</Route>
							<Route path='/choice'>
								<ChoiceRT />
							</Route>
							<Route path='/discrimination'>
								<DiscriminationRT />
							</Route>
							<Route path='/'>
								<Dashboard />
							</Route>
						</Switch>
					</div>
					<Footer />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
