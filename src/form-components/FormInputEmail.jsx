import { useForm, Controller } from 'react-hook-form';
import TextField from "@mui/material/TextField";


export const FormInputEmail = ({ control }) => {
    const {  formState: {errors} } = useForm();
    return (
        <Controller
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                    id="email"
                    labelWidth={40}
                    helperText={error ? error.message : null} 
                    error={!!error}
                    label="email"
                    onChange={onChange} 
                    value={value} 
                    fullWidth  
                    variant="outlined"
                />
            )}
            control={control}
            defaultValue=""
            slotProps={{
                textField: {
                    error: false,
                    }
                }}  
            rules={{
                required: { value: true, message: 'email address required' }, 
                pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid email address'
                }
            }}
        />
    )
}

