
import React, { useState } from 'react';

type FormInputType = 'text' | 'number' | 'password' | 'radio' | 'date' | 'email';

export interface FormInput {
    label: string;
    tableLabel: string;
    type: FormInputType;
    id: string;
    invalidFeedback?: string;
    placeholder?: string;
    required?: boolean;
    options?: RadioOption[];
}

export interface RadioOption {
    id: string;
    label: string;
    value: string;
}

interface FormProps {
    onSubmit?: () => void;
    className?: string;
}

export const Form: React.FC<FormProps> = ({ className, onSubmit, children }) => {

    const [formValidation, setFormValidation] = useState(false);

    const submit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setFormValidation(true);

        const array: any[] = []
        for (const i of e.target) {
            array.push(i)
        }

        if (array.every((e: any) => e.validity.valid)) {
            onSubmit?.();
            setFormValidation(false);
        }
    }

    const validationClassName = formValidation ? 'was-validated' : '';

    return (
        <form className={`${className} ${validationClassName}`} noValidate onSubmit={submit}>
            {children}
        </form>
    )
}

interface CustomDataFormProps {
    customDataForm: FormInput[];
    handleChange: (e: any) => void;
    currentState: any;
}

export const CustomDataForm: React.FC<CustomDataFormProps> = ({ customDataForm, handleChange, currentState }) => {

    return (
        <>
            {!!customDataForm?.length && customDataForm.map((formInput, i) =>
                formInput.type === 'radio' ?
                    <div key={i} className="form-group">
                        <label className='custom-control-inline'>{formInput.label}:</label>
                        {!!formInput.options && formInput.options.map((option, j) => (
                            <div key={j} className="custom-control custom-radio custom-control-inline">
                                <input
                                    type="radio"
                                    id={option.id}
                                    data-key={formInput.tableLabel}
                                    value={option.value}
                                    name={option.id}
                                    className="custom-control-input"
                                    checked={currentState[formInput.tableLabel] === option.value}
                                    onChange={handleChange}
                                />
                                <label className="custom-control-label" htmlFor={option.id}>{option.label}</label>
                            </div>
                        ))}
                    </div>
                    :
                    <div key={i} className="form-group">
                        <label htmlFor={formInput.id}>{formInput.label}:</label>
                        <input
                            type={formInput.type}
                            data-type={formInput.type}
                            className="form-control"
                            id={formInput.id}
                            placeholder={formInput.placeholder}
                            data-key={formInput.tableLabel}
                            onChange={handleChange}
                            required={formInput.required}
                        />
                        <div className="invalid-feedback">
                            {formInput.invalidFeedback}
                        </div>
                    </div>
            )}
        </>
    )
}
