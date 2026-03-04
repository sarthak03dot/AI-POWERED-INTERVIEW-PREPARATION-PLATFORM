import React from 'react';
import Select, { type Props as SelectProps } from 'react-select';
import { useFormContext, Controller } from 'react-hook-form';
import { alpha, FormControl, FormHelperText, InputLabel, useTheme } from '@mui/material';

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
    const theme = useTheme();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                    <InputLabel
                        shrink={true}
                        htmlFor={name}
                        sx={{
                            background: theme.palette.background.paper,
                            px: 1,
                            borderRadius: 1,
                            color: 'text.secondary',
                            fontWeight: 700,
                            transform: 'translate(12px, -9px) scale(0.85)',
                            '&.Mui-focused': {
                                color: 'primary.main',
                            }
                        }}
                    >
                        {label}
                    </InputLabel>
                    <Select
                        inputId={name}
                        options={options}
                        value={options.find(c => c.value === value) || null}
                        onChange={(val) => onChange(val?.value)}
                        onBlur={onBlur}
                        ref={ref}
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                borderColor: fieldState.error
                                    ? theme.palette.error.main
                                    : (state.isFocused ? theme.palette.primary.main : theme.palette.divider),
                                boxShadow: state.isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                },
                                padding: '6px 4px',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)',
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '12px',
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                overflow: 'hidden',
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? theme.palette.primary.main
                                    : (state.isFocused ? alpha(theme.palette.primary.main, 0.1) : 'transparent'),
                                color: state.isSelected ? '#ffffff' : theme.palette.text.primary,
                                '&:active': {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                fontWeight: 600,
                                padding: '12px 16px',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: theme.palette.text.primary,
                                fontWeight: 600,
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
