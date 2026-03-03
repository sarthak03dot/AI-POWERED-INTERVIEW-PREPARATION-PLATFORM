import React from 'react';
import { TextField, type TextFieldProps } from '@mui/material';
import { useFormContext, Controller, type RegisterOptions } from 'react-hook-form';

type FormInputProps = {
    name: string;
    rules?: RegisterOptions;
} & TextFieldProps;

const FormInput: React.FC<FormInputProps> = ({ name, rules, ...otherProps }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue=""
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    {...otherProps}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ''}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />
            )}
        />
    );
};

export default FormInput;
