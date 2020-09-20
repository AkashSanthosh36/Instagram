import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Zoom from '@material-ui/core/Zoom';
import Divider from '@material-ui/core/Divider';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../../App';

const useStyles = makeStyles({
  card: {
    padding: 20,
    maxWidth: 400,
    textAlign: 'center',
    margin: '30px auto',
    // backgroundColor: '#b0bec5'
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
   toast: {
     backgroundColor: 'black',
   }
});

toast.configure()

function Signin(props) {
    const { state, dispatch } = useContext(UserContext)
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false)
    const history = useHistory()

    return (
        <div>
            {/* <Zoom in="true"> */}
            <Card className={classes.card}>
                    <h1 className={classes.title}>Instagram</h1>
                    <Formik
                        initialValues = {{
                          email: '',
                          password: ''
                        }}

                        validationSchema = {
                          Yup.object({
                            email: Yup.string()
                            .email('Invalid email format')
                            .required('Required'),
                            password: Yup.string()
                            .min(8, 'Password is too short - should be 8 characters minimum')
                            .matches(
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                'Invalid'
                            )
                            .required('Required')
                          })                        
                        }

                        onSubmit = { (values) => {
                            fetch("/signin", {
                              method: "post",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                email: values.email,
                                password: values.password
                              })
                            })
                            .then(res => res.json())
                            .then(data => {
                              if(data.error) {
                                toast.dark(data.error, {autoClose: 5000})
                              }
                              else{
                                localStorage.setItem("jwt", data.token)
                                localStorage.setItem("user", JSON.stringify(data.user))
                                dispatch({ type: "USER", payload: data.user})
                                toast.dark('Successfully signedin', {autoClose: 5000})
                                history.push('/')
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
                                    name="email"
                                    className={classes.textfield}
                                    as={ TextField }
                                    id="outlined-basic" 
                                    label="E-mail address"
                                    type="text" 
                                    variant="outlined"
                                    size="small"
                                    fullWidth 
                                    error={(errors.email && touched.email) ? true : false}
                                    helperText={<ErrorMessage name="email" />}
                                />

                                <Field 
                                    name="password"
                                    className={classes.textfield}
                                    as={ TextField }
                                    id="outlined-adornment-password" 
                                    label="Password" 
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

                                <Button className={classes.button} type="submit" fullWidth>Sign In</Button>
                            </Form>
                        )}    
                    </Formik>
                    <Divider style={{ marginBottom: 30, marginTop: 30, color: "red" }} />
                    <Link to='/reset' style={{ textDecoration: "none", color: "black" }}>
                      <Typography>
                        Forgot Password?
                      </Typography>
                    </Link>  
            </Card>
            <Card className={classes.card}>
              <Typography>
                  Don't have an account? <Link to='/signup' style={{ textDecoration: "none", color: "blue" }}>Signup</Link>
              </Typography>
            </Card>
            {/* </Zoom> */}
        </div>
    );
}

export default Signin;