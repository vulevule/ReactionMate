import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { Collapse, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import { GoCheck } from 'react-icons/go';
import { IoIosLink } from 'react-icons/io';
import { MdContentCopy, MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TestConfiguration } from '../../../model/Experiment';
import { Admin } from '../../../model/User';
import { getAllExperiments } from '../../../services';
import { Experiment } from './../../../model/Experiment';
import { createExperiment, deleteExperiment, updateExperiment } from './../../../services/experimentServices';
import { dateFromNow } from './../../../utils/calcs';
import { useStateWithStorage } from './../../../utils/inits';
import { formatDate } from './../../../utils/other';
import { Form, FormInput } from './../../utilities/Forms';
import { Spinner } from './../../utilities/Loaders';
import './experiments.scss';
import { RequiredDataSection } from './RequiredDataSection';
import { TestsSection } from './TestsSection';

export const ExperimentsConfigPage: React.FC = () => {

  const [admin] = useStateWithStorage<Admin>('admin', false);
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loadingExp, setLoadingExp] = useState(false)

  const [selectedExp, setSelectedExp] = useState<Experiment>()

  const [showCreateExp, setShowCreateExp] = useState(false);
  const expandCreateExp = () => setShowCreateExp(true);
  const shrinkCreateExp = () => setShowCreateExp(false);

  const [showUpdateExp, setShowUpdateExp] = useState(false);
  const expandUpdateExp = () => setShowUpdateExp(true);
  const shrinkUpdateExp = () => setShowUpdateExp(false);

  useEffect(() => {
    loadExperiments();
  }, [])

  const loadExperiments = async () => {
    if (!admin.token) return;

    setLoadingExp(true);
    const [data, status] = await getAllExperiments(admin.token);
    if (data && status === 200) {
      setExperiments(data as Experiment[]);
    } else {
      toast.error(data)
      window.location.pathname = '/'
      return;
    }
    setLoadingExp(false);
  }

  const selectExp = (idx: number) => {
    setSelectedExp(experiments[idx]);
    expandUpdateExp();
  }

  const onCreated = (exp: Experiment) => {
    setExperiments(old => [exp].concat(old))
    shrinkCreateExp();
  }

  const onUpdated = (exp: Experiment) => {
    const newArray = [...experiments];
    newArray[newArray.findIndex(e => e.id === exp.id)] = exp
    setExperiments(newArray);
    shrinkUpdateExp();
  }

  const onDeleted = (id: string) => {
    setExperiments(old => old.filter(e => e.id !== id));
    shrinkUpdateExp();
  }

  return (
    <div className='mt-3'>
      <AllExperiments loadingExp={loadingExp} experiments={experiments} onDeleted={onDeleted} onDisabled={onUpdated} onRowClick={selectExp} />

      <Collapse in={showUpdateExp} mountOnEnter>
        <div>
          <div className='updateHeader mb-3'>
            <h4>
              Update experiment
            </h4>
          </div>
          <UpdateExperimentForm onUpdated={onUpdated} experiment={selectedExp} onCancel={shrinkUpdateExp} onDeleted={onDeleted} />
        </div>
      </Collapse>

      <div>
        <div>
          <button
            className="btn btn-link"
            onClick={showCreateExp ? shrinkCreateExp : expandCreateExp}
          >
            Create new {!showCreateExp ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}
          </button>
        </div>
        <Collapse in={showCreateExp} mountOnEnter>
          <div>
            <div className='updateHeader mb-3'>
              <h4>
                Create new experiment
              </h4>
            </div>
            <CreateExperimentForm onCreated={onCreated} onCancel={shrinkCreateExp} />
          </div>
        </Collapse>
      </div>

    </div>
  )
}

interface ExperimentsProps {
  experiments: Experiment[];
  onDeleted: (id: string) => void;
  onDisabled: (exp: Experiment) => void;
  onRowClick: (idx: number) => void;
}

interface AllExperimentsProps extends ExperimentsProps {
  loadingExp: boolean;
}

const AllExperiments: React.FC<AllExperimentsProps> = ({ experiments, loadingExp, ...props }) => {
  return (
    <div className='w-100 card shadow-sm mb-3'>
      <div className='card-body text-center'>
        <h5 className='card-title'>All experiments</h5>
        <div className='card-text'>
          {loadingExp ?
            <div className="w-100 flex-center-all">
              <Spinner />
            </div>
            :
            experiments?.length ?
              <ExperimentsTable experiments={experiments} {...props} />
              :
              <div>
                <h1>No experiments yet</h1>
              </div>
          }

        </div>
      </div>
    </div>
  )
}

const ExperimentsTable: React.FC<ExperimentsProps> = ({ experiments, onDeleted, onDisabled, onRowClick }) => {
  return (
    <div>
      <div className='table-responsive'>
        <table className='table-sm w-100'>
          <thead><tr>
            <th scope="col">Link</th>
            <th scope="col">Name</th>
            <th scope="col">Created</th>
            <th scope="col">Expiration</th>
            <th scope="col">Required Data</th>
            <th scope="col">Tests</th>
            <th scope="col">AMR*</th>
            <th scope="col">Enabled</th>
          </tr></thead>

          <tbody>
            {experiments?.map((exp, i) => (
              <SingleRow key={i} data={exp} onDeleted={onDeleted} onDisabled={onDisabled} onRowClick={() => onRowClick(i)} />
            ))}
          </tbody>
        </table>
      </div>
      <div className='text-left pt-3'>
        <small className='text-muted'>* Accept Multiple Responses</small>
      </div>

    </div>
  )
}

interface SingleRowProps {
  data: Experiment;
  onDisabled: (exp: Experiment) => void;
  onDeleted: (id: string) => void;
  onRowClick: () => void;
}

const SingleRow: React.FC<SingleRowProps> = ({ data, onDeleted, onRowClick }) => {
  const { id, name, requiredDataConfig, testsConfig, created, expiration, disabled, allowMultipleAnswers, link } = data;

  const [admin] = useStateWithStorage<Admin>('admin', false);
  const [deleting, setDeleting] = useState(false)

  const requredDataString = () => {
    const requiredData = requiredDataConfig;
    if (!requiredData?.length) return 'N/A';
    if (requiredData.length > 2) {
      return requiredData.slice(0, 2).map(e => e.label).join(', ').concat('...');
    } else {
      return requiredData.map(e => e.label).join(', ')
    }
  }

  const testsString = () => {
    return testsConfig.map(e => `${e.type} - ${e.tries}`).map((t, i) => <span key={i}>{t}<br /></span>)
  }

  const deleteExp = async () => {
    const { token } = admin;
    if (!token) return;

    setDeleting(true);
    const [data, status] = await deleteExperiment(id, token);
    setDeleting(false);

    if (status === 200) {
      toast.success('Deleted!')
      onDeleted?.(id);
    } else {
      toast.error(data)
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?\nThis operation can not be undone.')) {
      deleteExp();
    }
  }

  const copyToClipboard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (copy(link)) {
      toast.info('Copied', { autoClose: 2000, position: 'top-center', hideProgressBar: true, closeButton: false });
    }
  }

  const popover = (
    <Popover id={link}>
      <Popover.Content>
        <span>
          <a href={link} target='_blank' rel="noopener noreferrer">{link}</a>
          {document.queryCommandSupported('copy') &&
            <MdContentCopy className='pointer ml-2 hover-opacity' size={20} onClick={copyToClipboard} />
          }
        </span>
      </Popover.Content>
    </Popover>
  )

  return (
    <tr className="tableRow" onClick={onRowClick}>
      <td>
        <OverlayTrigger trigger={['focus']} placement='top' overlay={popover}>
          <button className="btn btn-link"><IoIosLink size={20} onClick={e => e.stopPropagation()} /></button>
        </OverlayTrigger>
      </td>
      <td>{name || 'N/A'}</td>
      <td>{formatDate(created, 'custom')}</td>
      <td>{formatDate(expiration, 'custom')}</td>
      <td>{requredDataString()}</td>
      <td>{testsString()}</td>
      <td>{allowMultipleAnswers && <GoCheck className='text-green' />}</td>
      <td>{!disabled && <GoCheck className='text-green' />}</td>
      <td>
        {deleting ?
          <Spinner small />
          :
          <button
            type="button"
            className="close text-red"
            aria-label="Delete"
            onClick={handleDelete}
            title="Delete"
          >
            <span aria-hidden="true">&times;</span>
          </button>}
      </td>
    </tr>
  )
}

interface ExperimentBaseFormProps {
  onCreated?: (exp: Experiment) => void;
  onUpdated?: (exp: Experiment) => void;
  onCancel: () => void;
  onDeleted?: (id: string) => void;
  mode?: 'create' | 'update';
  experiment?: Experiment;
}

const CreateExperimentForm: React.FC<ExperimentBaseFormProps> = props => (
  <ExperimentBaseForm {...props} />
);

const UpdateExperimentForm: React.FC<ExperimentBaseFormProps> = props => (
  <ExperimentBaseForm {...props} mode='update' />
);

const ExperimentBaseForm: React.FC<ExperimentBaseFormProps> = ({
  onCreated, onUpdated, onDeleted, onCancel, mode = 'create', experiment: exp
}) => {
  const [admin] = useStateWithStorage<Admin>('admin', false);

  const initExpirationString = (date?: Date) => {
    return date?.toISOString().substring(0, 19) || dateFromNow({ 'day': 7 }).toISOString().substring(0, 19);
  }

  const [requiredData, setRequiredData] = useState<FormInput[]>(exp?.requiredDataConfig || [])
  const [testsConfig, setTestsConfig] = useState<TestConfiguration[]>(exp?.testsConfig || [])
  const [expiration, setExpiration] = useState<string>(initExpirationString(exp?.expiration));
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(exp?.allowMultipleAnswers || false)
  const [disabled, setDisabled] = useState(exp?.disabled || false);
  const [name, setName] = useState<string | undefined>(exp?.name)

  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createdExperiment, setCreatedExperiment] = useState<Experiment>()
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    setRequiredData(exp?.requiredDataConfig || []);
    setTestsConfig(exp?.testsConfig || []);
    setExpiration(initExpirationString(exp?.expiration));
    setAllowMultipleAnswers(exp?.allowMultipleAnswers || false);
    setDisabled(exp?.disabled || false);
  }, [exp])

  const create = async () => {
    const { token } = admin;
    if (!token) return;

    const creationData = {
      token,
      name,
      requiredData,
      testsConfig,
      expiration,
      allowMultipleAnswers
    }

    setSending(true);
    const [data, status] = await createExperiment(creationData);
    setSending(false);

    if (data && status === 200) {
      setCreatedExperiment(data as Experiment);
      openModal();
      onCreated?.(data as Experiment);
    } else {
      toast.error(data)
    }
  }

  const update = async () => {
    const { token } = admin;
    if (!token || !exp) return;

    const { id } = exp;

    const updatingData = {
      id,
      name,
      token,
      requiredData,
      testsConfig,
      expiration,
      allowMultipleAnswers,
      disabled
    }

    setSending(true);
    const [data, status] = await updateExperiment(updatingData);
    setSending(false);

    if (data && status === 200) {
      toast.success('Updated!')
      onUpdated?.(data as Experiment);
    } else {
      toast.error(data)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure?\nThis operation can not be undone.')) {
      deleteExp();
    }
  }

  const deleteExp = async () => {
    const { token } = admin;
    if (!token || !exp) return;

    const { id } = exp;

    setDeleting(true);
    const [data, status] = await deleteExperiment(id, token);
    setDeleting(false);

    if (status === 200) {
      toast.success('Deleted!')
      onDeleted?.(id);
    } else {
      toast.error(data)
    }
  }

  return (
    <div className='formWrapper mb-3 pb-3'>
      <Form onSubmit={mode === 'create' ? create : update}>
        <div className="form-inline row">
          <div className="col-auto form-group">
            <label htmlFor="expiration" className='mr-3'>Name (optional)</label>
            <input
              type="text"
              className="form-control"
              id="expiration"
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="col-auto form-group">
            <label htmlFor="expiration" className='mr-3'>Expiration</label>
            <input
              type="datetime-local"
              className="form-control"
              id="expiration"
              onChange={e => setExpiration(e.target.value)}
              value={expiration}
              required
            />
          </div>
          <div className="col-auto">
            <div className="custom-control custom-checkbox mt-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id={`allowMultipleAnswers${mode}`}
                checked={allowMultipleAnswers}
                onChange={e => setAllowMultipleAnswers(e.target.checked)}
              />
              <label className="custom-control-label" htmlFor={`allowMultipleAnswers${mode}`}>Allow multiple responses</label>
            </div>
          </div>
          {mode === 'update' &&
            <div className="custom-control custom-switch">
              <input
                className="custom-control-input"
                id={`enabled${mode}`}
                type="checkbox"
                checked={!disabled}
                onChange={e => setDisabled(!e.target.checked)}
              />
              <label className="custom-control-label" htmlFor={`enabled${mode}`}>{!disabled ? 'Enabled' : 'Disabled'}</label>
            </div>
          }
        </div>

        <div className='card-deck'>
          <div className='col-sm-8 px-0'>
            <RequiredDataSection inputData={requiredData} onUpdateData={setRequiredData} />
          </div>
          <div className='col-sm-4 px-0'>
            <TestsSection inputData={testsConfig} onUpdateData={setTestsConfig} />
          </div>
        </div>

        <div className="buttonsWrapper">
          <button
            type='button'
            className='btn btn-secondary px-4 mx-1'
            onClick={onCancel}
          >
            Cancel
          </button>
          {mode === 'update' &&
            <button
              type='button'
              className='btn btn-danger px-4 mx-1'
              onClick={handleDelete}
            >
              {deleting ? <Spinner small /> : 'Delete'}
            </button>
          }
          <button
            type='submit'
            className='btn btn-primary px-4 mx-1'
            disabled={sending || !testsConfig.length}
          >
            {sending ? <Spinner small /> : mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </Form>
      <SuccessfulCreationModal experiment={createdExperiment} show={showModal} onHide={closeModal} />
    </div>
  )
}

interface ModalProps {
  show: boolean;
  onHide: () => void;
  experiment?: Experiment;
}

const SuccessfulCreationModal: React.FC<ModalProps> = ({ show, onHide, experiment }) => {
  const link = experiment?.link;

  const copyToClipboard = () => {
    if (link && copy(link)) {
      toast.info('Copied', { autoClose: 2000, position: 'top-center', hideProgressBar: true, closeButton: false });
      onHide();
    }
  }

  return (
    <Modal show={show} centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Experiment created</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Link: <a href={link} target='_blank' rel="noopener noreferrer">{link}</a>
          {document.queryCommandSupported('copy') &&
            <MdContentCopy className='pointer ml-2 hover-opacity' size={25} onClick={copyToClipboard} />
          }
        </span>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-secondary' onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  )
}
