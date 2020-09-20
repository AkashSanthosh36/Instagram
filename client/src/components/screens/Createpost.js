import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import blue from "@material-ui/core/colors/blue"; 
import { toast } from 'react-toastify'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
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
    input: {
      display: 'none',
    },
    button: {
        background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
        color: 'white',
    },
    icon: {
        color: blue[900],
        marginBottom: 30
    },
}));

toast.configure()

function Createpost(props) {
    const classes = useStyles();
    const history = useHistory()
    
    return (
        <div>
            <Card className={classes.card}>
                <h1 className={classes.title}>Instagram</h1>
                <Formik
                    initialValues = {{
                        title: '',
                        body: '',
                        image: ''
                    }}

                    validationSchema = {
                        Yup.object({
                            title: Yup.string()
                            .required('Required'),
                            body: Yup.string()
                            .required('Required'),
                            image: Yup.mixed()
                            .required("A file is required")
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
                            return fetch("/createpost", {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                                },
                                body: JSON.stringify({
                                    title: values.title,
                                    body: values.body,
                                    pic: data.url
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if(data.error) {
                                    toast.error(data.error, {autoClose: 5000})
                                }
                                else{
                                    toast.success('Post created successfully', {autoClose: 5000})
                                    history.push('/')
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    }}
                    
                >
                {formik  => (
                    <Form>
                        <Field 
                            name="title"
                            className={classes.textfield}
                            as={ TextField }
                            id="outlined-basic" 
                            label="Title"
                            type="text" 
                            variant="outlined"
                            size="small"
                            fullWidth 
                            error={(formik.errors.title && formik.touched.title) ? true : false}
                            helperText={<ErrorMessage name="title" />}
                        />

                        <Field 
                            name="body"
                            className={classes.textfield}
                            as={ TextField }
                            id="outlined-basic" 
                            label="Body"
                            type="text" 
                            variant="outlined"
                            size="small"
                            fullWidth 
                            error={(formik.errors.body && formik.touched.body) ? true : false}
                            helperText={<ErrorMessage name="body" />}
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
                       
                        <Button className={classes.button} type="submit" fullWidth>Create Post</Button>
                    </Form>
                )}    
                </Formik>
            </Card>
        </div>
    )
}

export default Createpost;