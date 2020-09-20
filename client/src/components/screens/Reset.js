import React from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom';

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
    const classes = useStyles();
    const history = useHistory()
    
    return (
        <div>
            <Card className={classes.card}>
                    <h1 className={classes.title}>Instagram</h1>
                    <Formik
                        initialValues = {{
                          email: ''
                        }}

                        validationSchema = {
                          Yup.object({
                            email: Yup.string()
                            .email('Invalid email format')
                            .required('Required')
                          })                        
                        }

                        onSubmit = { (values) => {
                            fetch("/reset-password", {
                              method: "post",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                email: values.email
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

                                <Button className={classes.button} type="submit" fullWidth>Submit</Button>
                            </Form>
                        )}    
                    </Formik>
            </Card>
        </div>
    );
}

export default Reset;