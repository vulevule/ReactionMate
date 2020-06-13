import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { TestConfiguration } from '../../../model/Experiment';
import { Form } from '../../utilities/Forms';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  onCancel: () => void;
  submit: (data: TestConfiguration) => void;
  inputData?: TestConfiguration;
}

export const AddTestModal: React.FC<ModalProps> = ({ show, onHide, onCancel, submit, inputData }) => {
	const initData = (): TestConfiguration => ({
		type: 'simple',
		tries: 5,
	})

	const [data, setData] = useState<TestConfiguration>(inputData || initData())

	useEffect(() => {
		inputData && setData(inputData)
	}, [inputData])

	const handleChange = (e: any) => {
		const elem = e.target;
		setData({
			...data,
			[elem.dataset.key]: elem.value,
		})
	}

	const handleSubmit = () => {
		submit(data)
		setData(initData())
	};

	const handleCancel = () => {
		onCancel()
		setData(initData())
	}

	return (
		<Modal show={show} centered onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Add new required data</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<div className="form-group">
						<label htmlFor="type">Type:</label>
						<select
							className="custom-select"
							id="type" data-key='type'
							onChange={handleChange}
							required
						>
							<option value='simple' selected={data.type === 'simple'}>Simple</option>
							<option value='choice' selected={data.type === 'choice'}>Choice</option>
							<option value='recognition' selected={data.type === 'recognition'}>Recognition</option>
							<option value='discrimination' selected={data.type === 'discrimination'}>Discrimination</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="label">Tries:</label>
						<input
							type="number"
							className="form-control"
							id="tries" data-key='tries'
							onChange={handleChange}
							value={data.tries}
							required
						/>
						<div className="invalid-feedback">
              Please specify number od tries.
						</div>
					</div>

				</Modal.Body>
				<Modal.Footer>
					<button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
					<button type='submit' className='btn btn-primary'>Save</button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}
