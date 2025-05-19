import React from "react";
import Button from "@mui/material/Button";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller, useForm } from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";

export const FormOtpInput = ({control}) => {
  // const { handleSubmit } = useForm({
  //   defaultValues: {
  //     otp: ""
  //   }
  // });

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="otp"
        control={control}
        rules={{ validate: (value) => value.length === 6 }}
        render={({ field, fieldState }) => (
          <Box>
            <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
            {fieldState.invalid ? (
              <FormHelperText error>OTP invalid</FormHelperText>
            ) : null}
          </Box>
        )}
      />
     <div>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </div>
    </form>
  )
}

