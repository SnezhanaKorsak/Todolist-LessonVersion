import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import style from "./Login.module.css"
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "./auth-reducer";
import {LoginParamsType} from "../../api/auth-api";
import {AppRootStateType} from "../../app/store";
import { Navigate } from 'react-router-dom';


export const Login = () => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            dispatch(loginTC(values));
            formik.resetForm();
        },
        validate: (values) => {
            const errors: Partial<Omit<LoginParamsType, "captcha">> = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'Must be more than 3 characters';
            }

            return errors;
        },

    })

    if(isLoggedIn) {
        return <Navigate to="/"/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...formik.getFieldProps("email")}
                                   onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email
                        && <div className={style.errorMessage}>{formik.errors.email}</div>}

                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps("password")}
                                   onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password
                        && <div className={style.errorMessage}>{formik.errors.password}</div>}

                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox/>}
                                          {...formik.getFieldProps("rememberMe")}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}

