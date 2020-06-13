import React, { useState, useEffect } from 'react';
import { Collapse, Modal } from 'react-bootstrap';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Form, FormInput, RadioOption } from '../../utilities/Forms';

interface ModalProps {
	dataNo: number;
	show: boolean;
	onHide: () => void;
	onCancel: () => void;
	submit: (data: FormInput) => void;
	inputData?: FormInput;
}

export const AddRequiredDataModal: React.FC<ModalProps> = ({ show, onHide, onCancel, submit, inputData, dataNo }) => {
	const initData = (): FormInput => ({
		label: '',
		tableLabel: '',
		id: '',
		type: 'text',
		required: false,
		options: undefined,
	})

	const [data, setData] = useState<FormInput>(inputData || initData())

	useEffect(() => {
		inputData && setData(inputData)
	}, [inputData])

	/** Initializes options with new array if input type is radio */
	const handleChange = (e: any) => {
		const elem = e.target;
		setData({
			...data,
			[elem.dataset.key]: elem.type === 'checkbox' ? elem.checked : elem.value,
			options: (elem.dataset.key === 'type' && elem.value === 'radio') ? [] : data.options
		})
	}

	const addOption = (option: RadioOption) => {
		const options = data.options;
		console.log(options);
		options && setData({
			...data,
			options: options.concat([option])
		})
	}

	const removeOption = (idx: number) => {
		const options = data.options;
		options && setData({
			...data,
			options: options.filter(opt => options.indexOf(opt) !== idx)
		})
	}

	const handleSubmit = () => {
		submit({
			...data,
			id: generateId()
		})
		setData(initData())
	};

	const handleCancel = () => {
		onCancel()
		setData(initData())
	}

	const generateId = () => {
		return `${data.label.replace(/\s/g, '')}${dataNo}`;
	}

	return (
		<Modal show={show} centered onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Add new required data</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<div className="form-group">
						<label htmlFor="label">Label:</label>
						<input
							type="text"
							className="form-control"
							id="label" data-key='label'
							onChange={handleChange}
							value={data.label}
							required
						/>
						<div className="invalid-feedback">
							Please enter a label.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="label">Table label:</label>
						<input
							type="text"
							className="form-control"
							id="tableLabel" data-key='tableLabel'
							onChange={handleChange}
							value={data.tableLabel}
							required
						/>
						<div className="invalid-feedback">
							Please enter a label.
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="type">Type:</label>
						<select
							className="custom-select"
							id="type" data-key='type'
							onChange={handleChange}
							required
						>
							<option value='text' selected={data.type === 'text'}>Text</option>
							<option value='date' selected={data.type === 'date'}>Date</option>
							<option value='number' selected={data.type === 'number'}>Number</option>
							<option value='radio' selected={data.type === 'radio'}>Radio</option>
						</select>
					</div>

					<Collapse in={data.type === 'radio'}>
						<div>
							<OptionsForm addOption={addOption} removeOption={removeOption} options={data.options || []} />
						</div>
					</Collapse>

					<Collapse in={data.type !== 'radio'}>
						<div>
							<div className="form-group">
								<label htmlFor="invalidFeedback">Invalid value feedback:</label>
								<input
									type="text"
									className="form-control"
									id="invalidFeedback" data-key='invalidFeedback'
									onChange={handleChange}
									value={data.invalidFeedback}
								/>
							</div>
							<div className="custom-control custom-checkbox">
								<input
									type="checkbox"
									className="custom-control-input"
									id="required" data-key='required'
									onChange={handleChange}
									checked={data.required}
								/>
								<label className="custom-control-label" htmlFor='required'>Required</label>
							</div>
						</div>
					</Collapse>

				</Modal.Body>
				<Modal.Footer>
					<button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
					<button type='submit' className='btn btn-primary'>Save</button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

interface OptionsFormProps {
	addOption: (data: RadioOption) => void;
	removeOption: (idx: number) => void;
	options: RadioOption[];
}

const OptionsForm: React.FC<OptionsFormProps> = ({ addOption, removeOption, options }) => {
	const initData = (): RadioOption => ({
		label: '',
		id: '',
		value: '',
	})

	const [optionData, setOptionData] = useState<RadioOption>(initData())

	const handleChange = (e: any) => {
		const elem = e.target;
		setOptionData({
			...optionData,
			[elem.dataset.key]: elem.value,
		})
	}

	const submit = () => {
		addOption({
			...optionData,
			id: `${optionData.value.replace(/\s/g, '')}${options.length}`,
		});
		setOptionData(initData());
	}

	return (
		<div className='card-deck mb-1 mt-1'>
			<div className='col-9 px-0 card shadow-sm'>
				<div className='card-body'>
					<h2 className='card-title'>Options:</h2>
					<div className='card-text text-center'>
						<table className='w-100 mb-3 table-sm'>
							{!!options.length &&
								<thead><tr>
									<th>Label</th>
									<th>Value</th>
								</tr></thead>
							}

							<tbody>
								{options.map((elem, i) => (
									<OptionRow key={i} data={elem} remove={() => removeOption(i)} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='col-3 px-0 card shadow-sm'>
				<div className='card-body'>
					<h2 className='card-title'>Add new:</h2>
					<div className='card-text text-center'>
						<Form onSubmit={submit}>
							<input
								type="text"
								className="form-control form-control-sm mb-1"
								id="label" data-key='label'
								placeholder='Label'
								onChange={handleChange}
								value={optionData.label}
								required
							/>
							<input
								type="text"
								className="form-control form-control-sm mb-1"
								id="value" data-key='value'
								placeholder='Value'
								onChange={handleChange}
								value={optionData.value}
								required
							/>
							<button type='submit' className='btn'>
								<IoIosAddCircleOutline className='pointer' size='2rem' />
							</button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

interface OptionRowProps {
	data: RadioOption;
	remove: () => void;
}

const OptionRow: React.FC<OptionRowProps> = ({ data, remove }) => {
	return (
		<tr>
			<td>{data.label}</td>
			<td>{data.value}</td>
			<td>
				<button
					type="button"
					className="close text-red"
					aria-label="Close"
					onClick={remove}
					title="Remove"
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</td>
		</tr>
	)
}
