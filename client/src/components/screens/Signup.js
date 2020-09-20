import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Zoom from '@material-ui/core/Zoom';
import Fab from "@material-ui/core/Fab";
import blue from "@material-ui/core/colors/blue"; 
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

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
  input: {
    display: 'none',
  },
  icon: {
    color: blue[900],
    marginBottom: 30
  },
});

toast.configure()

function Signup(props) {
    const classes = useStyles()
    const history = useHistory()
    const [showPassword, setShowPassword] = useState(false)
   
    return (
        <div>
            {/* <Zoom in="true"> */}
            <Card className={classes.card}>
                    <h1 className={classes.title}>Instagram</h1>
                    <Formik
                        initialValues = {{
                          name: '',
                          email: '',
                          password: '', 
                          image: ''
                        }}
                        
                        validationSchema = {
                          Yup.object({
                            name: Yup.string()
                            .required('Required'),
                            email: Yup.string()
                            .email('Invalid email format')
                            .required('Required'),
                            password: Yup.string()
                            .min(8, 'Password is too short - should be 8 characters minimum')
                            .matches(
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                'Invalid'
                            )
                            .required('Required'),
                            image: Yup.mixed()
                          })
                        }

                        onSubmit = { (values) => {
                            const data = new FormData()
                            data.append("file", values.image)
                            data.append("upload_preset", "Instagram")
                            data.append("cloud_name", "akashsan")
                            fetch("https://api.cloudinary.com/v1_1/akashsan/image/upload", {
                                method: "post",
                                body: data
                            })
                            .then(res => res.json())  
                            .then(data => {
                              return fetch("/signup", {
                                method: "post",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  name: values.name,
                                  email: values.email,
                                  password: values.password,
                                  pic: data.url
                                })
                              })
                              .then(res => res.json())
                              .then(data => {
                                if(data.error) {
                                  toast.error(data.error, {autoClose: 5000})
                                }
                                else{
                                  toast.success(data.message, {autoClose: 5000})
                                  history.push('/signin')
                                }
                              })
                              .catch(error => {
                                console.log(error)
                              })
                            })
                            .catch(error => {
                              console.log(error)
                            })
                          }
                        }
                    >
                        { formik => (
                            <Form>
                                <Field 
                                    name="name"
                                    className={classes.textfield}
                                    as={ TextField }
                                    id="outlined-basic" 
                                    label="Name"
                                    type="text" 
                                    variant="outlined"
                                    size="small"
                                    fullWidth 
                                    error={(formik.errors.name && formik.touched.name) ? true : false}
                                    helperText={<ErrorMessage name="name" />}
                                />

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
                                    error={(formik.errors.email && formik.touched.email) ? true : false}
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
                                    error={(formik.errors.password && formik.touched.password) ? true : false}
                                    helperText={<ErrorMessage name="password" />}
                                />
                                
                                <input
                                    name="image"
                                    accept="image/*"
                                    className={classes.input}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={(event) => {formik.setFieldValue("image", event.currentTarget.files[0])}}
                                />
                                <label htmlFor="contained-button-file">
                                    <Fab component="span" className={classes.icon}>
                                        <AddPhotoAlternateIcon />
                                    </Fab>
                                </label>

                                <Button className={classes.button} type="submit" fullWidth>Sign Up</Button>
                            </Form>
                        )}    
                    </Formik>
            </Card>
            <Card className={classes.card}>
              <Typography>
                  Have an account? <Link to='/signin' style={{ textDecoration: "none", color: "blue" }}>Signin</Link>
              </Typography>
            </Card>
            {/* </Zoom> */}
        </div>
    );
}

export default Signup;