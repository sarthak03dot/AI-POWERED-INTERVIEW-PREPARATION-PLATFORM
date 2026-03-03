import React from 'react';
import Select, { type Props as SelectProps } from 'react-select';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

type OptionType = {
    value: string;
    label: string;
};

type SelectInputProps = {
    name: string;
    label: string;
    options: OptionType[];
} & Omit<SelectProps<OptionType, false>, 'name' | 'options'>;

const SelectInput: React.FC<SelectInputProps> = ({ name, label, options, ...otherProps }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error} style={{ zIndex: 100 }}>
                    <InputLabel shrink={true} htmlFor={name} style={{ background: 'white', padding: '0 4px' }}>
                        {label}
                    </InputLabel>
                    <Select
                        inputId={name}
                        options={options}
                        value={options.find(c => c.value === value) || null}
                        onChange={(val) => onChange(val?.value)}
                        onBlur={onBlur}
                        ref={ref}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                borderColor: fieldState.error ? '#d32f2f' : (state.isFocused ? '#6366f1' : 'rgba(0, 0, 0, 0.23)'),
                                boxShadow: state.isFocused ? (fieldState.error ? '0 0 0 1px #d32f2f' : '0 0 0 1px #6366f1') : 'none',
                                '&:hover': {
                                    borderColor: fieldState.error ? '#d32f2f' : '#333333',
                                },
                                padding: '8.5px 14px',
                                borderRadius: '8px',
                            }),
                        }}
                        {...otherProps}
                    />
                    {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};

export default SelectInput;
