import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Admin } from '../../../model/User';
import { getAllConfigs, updateConfig } from '../../../services';
import { Config } from './../../../model/Config';
import { useStateWithStorage } from './../../../utils/inits';
import { Spinner, PageSpinner } from '../../utilities/Loaders';
import { Form } from './../../utilities/Forms';

export const GeneralConfigPage: React.FC = () => {
	const [generalConfig, setGeneralConfig] = useState<Config>()
	const [simpleConfig, setSimpleConfig] = useState<Config>()
	const [choiceConfig, setChoiceConfig] = useState<Config>();
	const [recognitionConfig, setRecognitionConfig] = useState<Config>();
	const [discriminationConfig, setDiscriminationConfig] = useState<Config>();
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		loadConfigs();
	}, [])

	const loadConfigs = async () => {
		setLoading(true);
		const [data, status] = await getAllConfigs();
		if (data && status === 200) {
			setGeneralConfig(data.general)
			setSimpleConfig(data.simple)
			setChoiceConfig(data.choice)
			setRecognitionConfig(data.recognition)
			setDiscriminationConfig(data.discrimination)
		} else {
			toast.error(`Error while loading configurations: ${data}`)
			window.location.pathname = '/'
			return;
		}
		setLoading(false);
	}

	if (loading) {
		return (
			<div className="w-100 vh-100 flex-center-all">
				<PageSpinner />
			</div>
		)
	} else {
		return (
			<div className='mt-3'>
				<div className='row'>
					<div className='col'>
						{generalConfig && <ConfigCard config={generalConfig} />}
					</div>
				</div>

				<div className='card-deck'>
					{simpleConfig && <ConfigCard config={simpleConfig} />}
					{choiceConfig && <ConfigCard config={choiceConfig} />}
				</div>
				<div className='card-deck'>
					{recognitionConfig && <ConfigCard config={recognitionConfig} />}
					{discriminationConfig && <ConfigCard config={discriminationConfig} />}
				</div>
			</div>
		)
	}
}

interface ConfigCardProps {
  config: Config;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ config: configProp }) => {
	const [admin] = useStateWithStorage<Admin>('admin', false);
	const [config, setConfig] = useState<Config>(configProp)
	const [sending, setSending] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const key = e.target.dataset.key;
		const value = e.target.value;

		key && setConfig(old => ({
			...old,
			[key]: value
		}))
	}

	const saveConfig = async () => {
		const { token } = admin;
		if (!token) return

		setSending(true);
		const [data, status] = await updateConfig(config, token);
		if (status === 200) {
			toast.success('Configuration updated')
		} else {
			toast.error(`Error while loading configurations: ${data}`)
			window.location.pathname = '/'
			return;
		}
		setSending(false);
	}

	return (

		<div className='card shadow-sm mb-3'>
			<div className='card-body'>
				<h5 className='card-title text-center text-capitalize'>{config.type}</h5>
				<Form onSubmit={saveConfig}>
					<div className='card-text form-row'>
						<div className='form-group col-6 col-lg-3'>
							<label htmlFor="tries" className='mr-3'>Tries</label>
							<input
								type="number"
								className="form-control"
								id="tries"
								data-key='tries'
								value={config?.tries}
								onChange={handleChange}
								required
								min={1}
							/>
							<div className="invalid-feedback">
                Minimum is 1 try.
							</div>
						</div>
						<div className='form-group col-6 col-lg-3'>
							<label htmlFor="minTimeout" className='mr-3'>Min timeout</label>
							<input
								type="number"
								className="form-control"
								id="minTimeout"
								data-key='minTimeout'
								value={config?.minTimeout}
								onChange={handleChange}
								required
								min={200}
							/>
							<div className="invalid-feedback">
                Minimum is 200ms.
							</div>
						</div>
						<div className='form-group col-6 col-lg-3'>
							<label htmlFor="maxTimeout" className='mr-3'>Max timeout</label>
							<input
								type="number"
								className="form-control"
								id="maxTimeout"
								data-key='maxTimeout'
								value={config?.maxTimeout}
								onChange={handleChange}
								required
								min={200}
								disabled={sending}
							/>
							<div className="invalid-feedback">
                Minimum is 200ms.
							</div>
						</div>
						<div className='form-group col-6 col-lg-3 d-flex justify-content-end align-items-end'>
							<button
								className='btn btn-primary rounded-pill px-4'
								type='submit'
							>
								{sending ? <Spinner small /> : 'Save'}
							</button>
						</div>
					</div>
				</Form >
			</div>
		</div >
	)
}
