import React, { useEffect, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import { Experiment } from '../../../model/Experiment';
import { Admin } from '../../../model/User';
import { exportMultipleExperimentResults, exportSingleExperimentResults, getAllExperiments } from '../../../services';
import { useStateWithStorage } from '../../../utils';
import { Form } from './../../utilities/Forms';

export const ExportData: React.FC = () => {

	return (
		<div className='mt-5'>
			<ExportSingleExperiment />
			<ExportMultipleExperiments />
		</div>
	)
}

const ExportSingleExperiment: React.FC = () => {
	const [admin] = useStateWithStorage<Admin>('admin', false);

	const [dateFrom, setDateFrom] = useState<string>();
	const [dateTo, setDateTo] = useState<string>();
	const [id, setId] = useState<string>('');

	const [experiments, setExperiments] = useState<Experiment[]>([])
	const [found, setFound] = useState<Experiment[]>([])
	const [show, setShow] = useState(true)
	const [criteria, setCriteria] = useState<string>('')

	useEffect(() => {
		loadExperiments();
	}, [])

	const loadExperiments = async () => {
		if (!admin.token) return;

		const [data, status] = await getAllExperiments(admin.token);
		if (data && status === 200) {
			setExperiments((data as Experiment[]).filter(e => !!e.name));
		} else {
			toast.error(data)
			window.location.pathname = '/'
			return;
		}
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCriteria(value)
		if (value.length > 2) {
			setFound(experiments.filter(e => e.name?.toLowerCase().includes(value.toLowerCase())))
		}
		setShow(true);
	}

	const handleSearchClick = (exp: Experiment) => {
		exp.name && setCriteria(exp.name)
		setId(exp.id)
		setShow(false)
	}

	const exportData = async () => {
		const { token } = admin;
		if (!token) return;

		const sendingData = {
			id,
			dateFrom,
			dateTo
		}

		const [data, status] = await exportSingleExperimentResults(sendingData, token);
		if (status === 200) {
			const url = window.URL.createObjectURL((data as any).data);
			const a = document.createElement('a');
			a.href = url;
			a.download = (data as any).fileName
			document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
			a.click();
			a.remove();

		} else {
			toast.error(data);
		}
	}

	return (
		<Form onSubmit={exportData} className='mb-5'>
			<h4>Export single experiment results</h4>
			<div className='form-row mt-3'>
				<div className="col-3 form-group dropdown">
					<label htmlFor="name" className='mr-2'>Search by name</label>
					<div className="input-group">
						<div className="input-group-prepend">
							<div className="input-group-text"><GoSearch /></div>
						</div>
						<input
							type="text"
							className="form-control"
							id="name"
							onChange={handleSearchChange}
							value={criteria}
						/>
						{criteria.length > 2 && show &&
							<ul className="dropdown-menu show w-100">
								{found.length ? found.map((exp, i) =>
									<li key={i} >
										<span className="dropdown-item pointer" onClick={() => handleSearchClick(exp)}>
											{exp.name} - {exp.id}
										</span>
									</li>
								)
									:
									<li>
										<span className="dropdown-item text-muted">
											<i>No results</i>
										</span>
									</li>
								}
							</ul>
						}
					</div>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="expId" className='mr-2'>ID</label>
					<input
						type="text"
						className="form-control"
						id="expId"
						onChange={e => setId(e.target.value)}
						value={id}
						required
					/>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="dateFrom" className='mr-2'>Results from</label>
					<input
						type="datetime-local"
						className="form-control"
						id="dateFrom"
						onChange={e => setDateFrom(e.target.value)}

					/>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="dateTo" className='mr-2'>Results to</label>
					<input
						type="datetime-local"
						className="form-control"
						id="dateTo"
						onChange={e => setDateTo(e.target.value)}
					/>
				</div>
			</div>
			<div className="d-flex justify-content-end">
				<button type='submit' className='btn btn-primary'>Export</button>
			</div>
		</Form>

	)
}

const ExportMultipleExperiments: React.FC = () => {
	const [admin] = useStateWithStorage<Admin>('admin', false);

	const [createdFrom, setCreatedFrom] = useState<string>();
	const [createdTo, setCreatedTo] = useState<string>();
	const [expirationFrom, setExpirationFrom] = useState<string>();
	const [expirationTo, setExpirationTo] = useState<string>();
	const [allowMultipleAnswers, setAllowMultipleAnswers] = useState<boolean>()
	const [includeAMR, setIncludeAMR] = useState<boolean>()

	const exportData = async () => {
		const { token } = admin;
		if (!token) return;

		const sendingData = {
			createdFrom,
			createdTo,
			expirationFrom,
			expirationTo,
			allowMultipleAnswers,
		}

		const [data, status] = await exportMultipleExperimentResults(sendingData, token);
		if (status === 200) {
			const url = window.URL.createObjectURL((data as any).data);
			const a = document.createElement('a');
			a.href = url;
			a.download = (data as any).fileName
			document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
			a.click();
			a.remove();

		} else {
			console.log(data);
			toast.error(data);
		}
	}

	const handleIncludeAMR = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIncludeAMR(e.target.checked);
		if (!e.target.checked) {
			setAllowMultipleAnswers(undefined);
		} else {
			setAllowMultipleAnswers(false);
		}
	}

	return (
		<Form onSubmit={exportData}>
			<h4>Export multiple experiment results</h4>
			<div className='form-row mt-3'>
				<div className="col-3 form-group">
					<label htmlFor="createdFrom" className='mr-2'>Created from</label>
					<input
						type="datetime-local"
						className="form-control"
						id="createdFrom"
						onChange={e => setCreatedFrom(e.target.value)}
					/>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="createdTo" className='mr-2'>Created to</label>
					<input
						type="datetime-local"
						className="form-control"
						id="createdTo"
						onChange={e => setCreatedTo(e.target.value)}
					/>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="expirationFrom" className='mr-2'>Expiration from</label>
					<input
						type="datetime-local"
						className="form-control"
						id="expirationFrom"
						onChange={e => setExpirationFrom(e.target.value)}
					/>
				</div>
				<div className="col-3 form-group">
					<label htmlFor="expirationTo" className='mr-2'>Expiration to</label>
					<input
						type="datetime-local"
						className="form-control"
						id="expirationTo"
						onChange={e => setExpirationTo(e.target.value)}
					/>
				</div>
			</div>
			<div className='d-flex justify-content-between'>
				<div className='d-flex flex-row'>
					<div className="custom-control custom-switch mr-2">
						<input
							type="checkbox"
							className="custom-control-input"
							id="allowedSwitch"
							onChange={handleIncludeAMR}
							checked={includeAMR}
						/>
						<label className="custom-control-label" htmlFor='allowedSwitch'>Include allowed multiple responses</label>
					</div>
					<div className="custom-control custom-checkbox">
						<input
							type="checkbox"
							className="custom-control-input"
							id='allowMultipleAnswers'
							disabled={!includeAMR}
							checked={allowMultipleAnswers}
							onChange={e => setAllowMultipleAnswers(e.target.checked)}
						/>
						<label className="custom-control-label" htmlFor='allowMultipleAnswers' />
					</div>
				</div>
				<button type='submit' className='btn btn-primary'>Export</button>
			</div>
		</Form>

	)
}
