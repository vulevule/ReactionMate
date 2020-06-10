import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { TestConfiguration, TestsConfigTemplate } from '../../../model/Experiment';
import { AddTestModal } from './AddTestModal';
import { useStateWithStorage } from '../../../utils';
import { Admin } from '../../../model/User';
import { getTemplates, createTemplate } from '../../../services/templateServices';
import { toast } from 'react-toastify';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';

interface Props {
  onUpdateData: (data: TestConfiguration[]) => void;
  inputData?: TestConfiguration[];
}

type Mode = 'create' | 'update';

export const TestsSection: React.FC<Props> = ({ onUpdateData, inputData }) => {
  const [admin] = useStateWithStorage<Admin>('admin', false);
  const [mode, setMode] = useState<Mode>('create');
  const [showModal, setShowModal] = useState(false);

  const openModal = (mode: Mode) => {
    setMode(mode);
    setShowModal(true)
  };

  const closeModal = () => setShowModal(false);

  const [tests, setTests] = useState<TestConfiguration[]>(inputData || []);
  const [selectedData, setSelectedData] = useState<TestConfiguration>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [templates, setTemplates] = useState<TestsConfigTemplate[]>([])
  const [templateName, setTemplateName] = useState<string>()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    loadTemplates();
  }, [])

  const loadTemplates = async () => {
    if (!admin.token) return;

    const [data, status] = await getTemplates('tests', admin.token);
    if (data && status === 200) {
      setTemplates(data as TestsConfigTemplate[]);
    } else {
      toast.error(`Error while loading templates: ${data}`)
    }
  }

  useEffect(() => {
    setTests(inputData || [])
  }, [inputData])

  const addRow = (data: TestConfiguration) => {
    const updated = tests.concat([data]);
    setTests(updated);
    onUpdateData(updated);

    closeModal();
  }

  const updateRow = (data: TestConfiguration) => {
    const updated = [...tests];
    updated[selectedIdx] = data
    setTests(updated);
    onUpdateData(updated);

    closeModal();
  }

  const submitData = (data: TestConfiguration) => {
    if (mode === 'create') {
      addRow(data);
    } else {
      updateRow(data);
    }
  }

  const removeRow = (idx: number) => {
    const updated = tests.filter(e => tests.indexOf(e) !== idx);
    setTests(updated);
    onUpdateData(updated);
  }

  const onSelect = (idx: number) => {
    setSelectedData(tests[idx]);
    setSelectedIdx(idx);
    openModal('update');
  }

  const selectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = templates[+e.target.value];
    setTests(template.data);
  }

  const saveTemplate = async () => {
    const { token } = admin;
    if (!token) return;

    const savingData = {
      token,
      name: templateName,
      data: tests
    }

    const [data, status] = await createTemplate('tests', savingData);
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
          Tests
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
            {!!tests.length &&
              <thead><tr>
                <th>Type</th>
                <th>Tries</th>
              </tr></thead>
            }

            <tbody>
              {tests.map((elem, i) => (
                <SingleRow key={i} data={elem} remove={() => removeRow(i)} onClickRow={() => onSelect(i)} />
              ))}
            </tbody>
          </table>
          <IoIosAddCircleOutline onClick={() => openModal('create')} className='pointer' size='2rem' />
        </div>
        {!!tests.length &&
          <div className='d-flex flex-row justify-content-end align-items-center'>
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

      <AddTestModal
        inputData={selectedData}
        show={showModal}
        onHide={closeModal}
        onCancel={closeModal}
        submit={submitData} />
    </div>
  )
}

interface SingleRowProps {
  data: TestConfiguration;
  remove: () => void;
  onClickRow: () => void;
}

const SingleRow: React.FC<SingleRowProps> = ({ data, remove, onClickRow }) => {

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    remove();
  }

  return (
    <tr className='tableRow' onClick={onClickRow}>
      <td className='text-capitalize'>{data.type}</td>
      <td>{data.tries}</td>
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
