import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, CustomDataForm, FormInput } from './Forms';
import { useStateWithStorage } from './../../utils/inits';
import { User } from './../../model/User';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  callback?: Function;
}

export const FormModal: React.FC<ModalProps> = ({ show, callback, onHide }) => {

  const [user, setUser] = useStateWithStorage<User>('user');
  const [config] = useStateWithStorage('config')
  const [additionalData, setUserAdditionalData] = useState({})
  const form = config.userAdditionalData

  useEffect(() => {
    (form as FormInput[]).map(formInput => {
      if (formInput.type === 'radio') {
        setUserAdditionalData(old => ({ ...old, [formInput.id!]: formInput.options?.[0].value }))
      }
    })

  }, [form]);

  const handleChange = (e: any) => {
    const key = e.target.dataset.key;
    const value = e.target.value;

    setUserAdditionalData(old => ({
      ...old,
      [key]: value
    }))
  }

  const submit = () => {
    setUser((old: User) => ({ ...old, additionalData }))
    const updated = { ...user, additionalData }
    callback?.(updated);
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Please provide us with next information before starting tests</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <CustomDataForm customDataForm={form} currentState={additionalData} handleChange={handleChange} />
          <div className='text-right'>
            <button type='button' className="btn btn-secondary mr-2" onClick={onHide}>Close</button>
            <button type='submit' className="btn btn-primary">Continue</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
