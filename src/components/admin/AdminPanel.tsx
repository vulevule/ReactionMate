import React, { useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { ExperimentsConfigPage } from './experiments/ExperimentsConfigPage';
import { GeneralConfigPage } from './configs/GeneralConfigPage';
import { ExportData } from './exportData/ExportDataSection';

export const AdminPanel: React.FC = () => {

	const { path, url } = useRouteMatch();
	const tabs: { [key in string]: string } = {
		config: 'configurations',
		experiments: 'experiments',
		export: 'export data'
	}

	const getInitSelected = () => {
		const _tabs = Object.keys(tabs);
		return _tabs.find(e => window.location.pathname.endsWith(e)) || _tabs[0]
	}

	const [selected, setSelected] = useState(getInitSelected());

	return (
		<div className='panelWrapper'>
			<AdminHeader />
			<div className='pt-3 content'>
				<div className='mt-1'>
					<ul className="nav nav-tabs nav-justified">
						{Object.keys(tabs).map((tab, i) =>
							<li key={i} className="nav-item">
								<Link
									className={'nav-link text-capitalize ' + (selected === tab ? 'active' : '')}
									onClick={() => setSelected(tab)}
									to={`${url}/${tab}`}
								>
									{tabs[tab]}
								</Link>
							</li>
						)}
					</ul>
				</div>

				<Switch>
					<Route exact path={path}>
						<GeneralConfigPage />
					</Route>
					<Route path={`${path}/config`}>
						<GeneralConfigPage />
					</Route>
					<Route path={`${path}/experiments`}>
						<ExperimentsConfigPage />
					</Route>
					<Route path={`${path}/export`}>
						<ExportData />
					</Route>
					<Route path='/'>
						<GeneralConfigPage />
					</Route>
				</Switch>
			</div>
		</div>
	)
}
