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
                    label="Email*"
                    onChange={onChange} 
                    value={value} 
                    fullWidth  
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
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
                required: { value: true, message: 'email required ex: xxx@xxx.com' }, 
                pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'enter valid email ex: xxx@xxx.com'
                }
            }}
        />
    )
}

