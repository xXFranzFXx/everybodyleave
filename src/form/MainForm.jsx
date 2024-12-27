import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSocketContext } from '../context/SocketProvider';
import { FormProvider } from 'react-hook-form';
import { useForm } from "react-hook-form";
import { FormInputDate } from '../form-components/FormInputDate';
import { FormInputTel } from '../form-components/FormInputTel';
import { FormInputTime } from '../form-components/FormInputTime';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const MainForm = () => {
    
    const { state } = useSocketContext();
    const methods = useForm({ defaultValues: state || "" });
    const { handleSubmit, getValues, reset, control, setValue } = methods;



    return (
        <FormProvider {...methods}>
        
        </FormProvider>
    )

}