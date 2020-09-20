import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles({
    card: {
      padding: 20,
      maxWidth: 400,
      textAlign: 'center',
      margin: '30px auto',
    },
    title: {
      fontSize: 50,
      fontFamily: 'Grand Hotel, cursive',
      flexGrow: 1,
    },
    textfield: {
      '& label.Mui-focused': {
          color: 'black',
        },
      '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#00000',
          },
          '&:hover fieldset': {
            borderColor: 'black',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black',
            borderLeftWidth: 6,
          },
        },
        marginBottom: 30,
    }, 
    button: {
      background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
      color: 'white',
    },
});

function Reset(props) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const {token} = useParams()
    const classes = useStyles();
    const history = useHistory()
    
    return (
        <div>
            <Card className={classes.card}>
                    <h1 className={classes.title}>Instagram</h1>
                    <Formik
                        initialValues = {{
                          password: '',
                          confirmPassword: ''
                        }}

                        validationSchema = {
                          Yup.object({
                            password: Yup.string()
                            .min(8, 'Password is too short - should be 8 characters minimum')
                            .matches(
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                'Invalid'
                            )
                            .required('Required'),
                            confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Passwords must match')
                            .required('Required')
                          })                        
                        }

                        onSubmit = { (values) => {
                            fetch("/new-password", {
                              method: "post",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                password: values.password, 
                                token: token
                              })
                            })
                            .then(res => res.json())
                            .then(data => {
                              if(data.error) {
                                toast.dark(data.error, {autoClose: 5000})
                              }
                              else{
                                toast.dark(data.message, {autoClose: 5000})
                                history.push('/signin')
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                          }
                        }
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field 
                                    name="password"
                                    className={classes.textfield}
                                    as={ TextField }
                                    id="outlined-adornment-password" 
                                    label="New Password" 
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    size="small"
                                    fullWidth 
                                    autoComplete="off"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                onMouseDown={(event) => event.preventDefault()}
                                                edge="end"
                                                >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            </InputAdornment>),
                                    }}
                                    error={(errors.password && touched.password) ? true : false}
                                    helperText={<ErrorMessage name="password" />}
                                />

                                <Field 
                                    name="confirmPassword"
                                    className={classes.textfield}
                                    as={ TextField }
                                    id="outlined-adornment-password" 
                                    label="Confirm Password" 
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    size="small"
                                    fullWidth 
                                    autoComplete="off"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                                onMouseDown={(event) => event.preventDefault()}
                                                edge="end"
                                                >
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            </InputAdornment>),
                                    }}
                                    error={(errors.confirmPassword && touched.confirmPassword) ? true : false}
                                    helperText={<ErrorMessage name="confirmPassword" />}
                                />

                                <Button className={classes.button} type="submit" fullWidth>Reset password</Button>
                            </Form>
                        )}    
                    </Formik>
            </Card>
        </div>
    );
}

export default Reset;