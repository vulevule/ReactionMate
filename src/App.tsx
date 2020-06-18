import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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

	const routes = [
		{ path: '/dashboard', Component: Dashboard },
		{ path: '/stats', Component: Stats },
		{ path: '/login', Component: Login },
		{ path: '/signup', Component: Signup },
		{ path: '/simple', Component: SimpleRT },
		{ path: '/recognition', Component: RecognitionRT },
		{ path: '/choice', Component: ChoiceRT },
		{ path: '/discrimination', Component: DiscriminationRT },
		{ path: '/', Component: Dashboard },
	]

	const location = useLocation();
	const currentKey = location.pathname.split('/')[1] || '/'

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
					<div className='pt-2 content'>
						<TransitionGroup className='page-relative'>
							<CSSTransition
								appear
								key={currentKey}
								timeout={300}
								classNames='slide-forward'
								unmountOnExit
							>
								<div className="slide">
									<Switch location={location}>
										{routes.map(({ path, Component }) => (
											<Route key={path} path={path}>
												<Component />
											</Route>
										))}
									</Switch>
									<Footer />
								</div>
							</CSSTransition>
						</TransitionGroup>
					</div>
					{/* Alternative place for footer */}
				</Route>
			</Switch>
		</div>
	);
}

export default App;
