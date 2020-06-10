import React, { useEffect, useState } from 'react';
import { GoCheck } from 'react-icons/go';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { toast } from 'react-toastify';
import { RequiredDataTemplate } from '../../../model/Experiment';
import { Admin } from '../../../model/User';
import { createTemplate, getTemplates } from '../../../services/templateServices';
import { useStateWithStorage } from '../../../utils';
import { FormInput } from '../../utilities/Forms';
import { AddRequiredDataModal } from './AddRequiredDataModal';

interface Props {
  onUpdateData: (data: FormInput[]) => void;
  inputData?: FormInput[];
}

type Mode = 'create' | 'update';

export const RequiredDataSection: React.FC<Props> = ({ onUpdateData, inputData }) => {

  const [admin] = useStateWithStorage<Admin>('admin', false);
  const [mode, setMode] = useState<Mode>('create');
  const [showModal, setShowModal] = useState(false);

  const openModal = (mode: Mode) => {
    setMode(mode);
    setShowModal(true)
  };

  const closeModal = () => setShowModal(false);

  const [requiredData, setRequiredData] = useState<FormInput[]>(inputData || []);
  const [selectedData, setSelectedData] = useState<FormInput>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [templates, setTemplates] = useState<RequiredDataTemplate[]>([])
  const [templateName, setTemplateName] = useState<string>()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    loadTemplates();
  }, [])

  useEffect(() => {
    setRequiredData(inputData || [])
  }, [inputData])

  const loadTemplates = async () => {
    if (!admin.token) return;

    const [data, status] = await getTemplates('reqData', admin.token);
    if (data && status === 200) {
      setTemplates(data as RequiredDataTemplate[]);
    } else {
      toast.error(`Error while loading templates: ${data}`)
    }
  }

  const addRow = (data: FormInput) => {
    const updated = requiredData.concat([data]);
    setRequiredData(updated);
    onUpdateData(updated);

    closeModal();
  }

  const updateRow = (data: FormInput) => {
    const updated = [...requiredData];
    updated[selectedIdx] = data
    setRequiredData(updated);
    onUpdateData(updated);

    closeModal();
  }

  const submitData = (data: FormInput) => {
    if (mode === 'create') {
      addRow(data);
    } else {
      updateRow(data);
    }
  }

  const removeRow = (idx: number) => {
    const updated = requiredData.filter(e => requiredData.indexOf(e) !== idx);
    setRequiredData(updated);
    onUpdateData(updated);
  }

  const onSelect = (idx: number) => {
    setSelectedData(requiredData[idx]);
    setSelectedIdx(idx);
    openModal('update');
  }

  const selectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = templates[+e.target.value];
    setRequiredData(template.data);
  }

  const saveTemplate = async () => {
    const { token } = admin;
    if (!token) return;

    const savingData = {
      token,
      name: templateName,
      data: requiredData
    }

    const [data, status] = await createTemplate('reqData', savingData);
    if (data && status === 200) {
      setTemplates(old => old.concat([data]));
      toast.success('Saved', { autoClose: 2000, position: 'top-center', hideProgressBar: true, closeButton: false });
      setShowDropdown(false);
    } else {
      toast.error(data)
    }
  }

  return (
    <div className='card shadow-sm mb-3 mt-3'>
      <div className='card-body'>
        <h6 className='card-title d-flex flex-row justify-content-between'>
          Required data
          <select
            className="form-control form-control-sm w-auto"
            onChange={selectTemplate}
          >
            <option value="" disabled selected>Load from template</option>
            {templates.map((t, i) =>
              <option key={i} value={i}>{t.name}</option>
            )}
          </select>
        </h6>
        <div className='card-text text-center'>
          <table className='w-100 mb-3 table-sm'>
            {!!requiredData.length &&
              <thead><tr>
                <th>Label</th>
                <th>Type</th>
                <th>IVF / Options*</th>
                <th>Required</th>
              </tr></thead>
            }

            <tbody>
              {requiredData.map((elem, i) => (
                <SingleRow key={i} data={elem} remove={() => removeRow(i)} onClickRow={() => onSelect(i)} />
              ))}
            </tbody>
          </table>
          <IoIosAddCircleOutline onClick={() => openModal('create')} className='pointer' size='2rem' />
        </div>
        {!!requiredData.length &&
          <div className='d-flex flex-row justify-content-between align-items-center'>
            <small className='text-muted'>* Invalid Value Feedback / Options if input type is radio</small>
            <div className='dropdown'>
              <button
                className="btn btn-link"
                type='button'
                onClick={() => setShowDropdown(old => !old)}
              >
                Save as a template {!showDropdown ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}
              </button>
              <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                <div className="save-template-dropdown-item form-inline">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Enter name"
                    autoFocus
                    onChange={e => setTemplateName(e.target.value)}
                  />
                  <button
                    className="btn btn-link"
                    type='button'
                    onClick={saveTemplate}
                  >
                    Save
                </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <AddRequiredDataModal
        inputData={selectedData}
        show={showModal}
        onHide={closeModal}
        onCancel={closeModal}
        submit={submitData}
        dataNo={requiredData.length}
      />
    </div>
  )
}

interface SingleRowProps {
  data: FormInput;
  remove: () => void;
  onClickRow: () => void;
}

const SingleRow: React.FC<SingleRowProps> = ({ data, remove, onClickRow }) => {
  const generateOptionsString = () => {
    if (!data.options) return;
    if (data.options.length > 2) {
      return data.options.slice(0, 2).map(e => e.label).join(', ').concat('...');
    } else {
      return data.options.map(e => e.label).join(', ')
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    remove();
  }

  return (
    <tr className='tableRow' onClick={onClickRow}>
      <td>{data.label}</td>
      <td className='text-capitalize'>{data.type}</td>
      <td>{data.type === 'radio' ? generateOptionsString() : data.invalidFeedback}</td>
      <td>{data.required && <GoCheck className='text-green' />}</td>
      <td>
        <button
          type="button"
          className="close text-red"
          aria-label="Close"
          onClick={handleRemove}
          title="Remove"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </td>
    </tr>
  )
}
