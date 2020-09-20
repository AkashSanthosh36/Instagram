import React, { useEffect, useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify'
import Typography from '@material-ui/core/Typography';

import { UserContext } from '../../App'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '600px',
        margin: '0px auto',
    },
    profileContent: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '18px 0px',
    //   borderBottom: '1px solid grey',
    },
    profileImage: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
    gallery: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        width: '30%',
    },
    button: {
        margin: '10px 0px 0px 25px',
        textTransform: 'none',
    },
    input: {
        display: 'none',
    },
}));

function Profile(props) {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const classes = useStyles();

    useEffect( () => {
        fetch('/mypost', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        })
        .then(res => res.json())
        .then(result => {
          setUserProfile(result)
        })
    }, [])

    const updatePhoto = (image) => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Instagram")
        data.append("cloud_name", "akashsan")
        fetch("https://api.cloudinary.com/v1_1/akashsan/image/upload", {
            method: "post",
            body: data
        })
        .then(res => res.json())  
        .then(data => {
            return fetch("/updatepic", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    pic: data.url
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    toast.error(data.error, {autoClose: 5000})
                }
                else{
                    setUserProfile( (prevState) => {
                        return {
                            ...prevState,
                            user: { 
                                ...prevState.user,
                                pic: data.result.pic 
                            }
                        }
                    })
                    localStorage.setItem("user", JSON.stringify({...state, pic: data.result.pic}))
                    dispatch({type: "UPDATEPIC", payload: {pic: data.result.pic}})
                    toast.success(data.message, {autoClose: 5000})
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

    return (
        <>
        {
            userProfile ?
            (
            <div className={classes.root}>
            <div className={classes.profileContent}>

                <div>
                    <Avatar 
                        src={userProfile.user.pic}
                        className={classes.profileImage}
                    />
                    <input
                        name="image"
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        onChange={(event) => updatePhoto(event.target.files[0])}
                    />
                    <label htmlFor="contained-button-file">
                        <Button className={classes.button} variant="contained" color="primary" component="span">
                            <Typography>
                                Update Pic
                            </Typography>
                        </Button>           
                    </label>
                </div>
                <div>
                    <Typography variant="h4" style={{ marginTop: "40px" }}>{userProfile.user.name}</Typography>
                    <div style={{ display: "flex", justifyContent: "space-between" , width: "108%" }}>
                        <Typography variant="h6">{userProfile.myPosts.length} Posts</Typography>
                        <Typography variant="h6">{userProfile.user.followers.length} Followers</Typography>
                        <Typography variant="h6">{userProfile.user.following.length} Following</Typography>
                    </div>  
                </div>
            </div>
            
            <Divider style={{ marginBottom: 30}}/>
            <div className={classes.gallery}>
                {
                    userProfile.myPosts.map(item => {
                        return (
                            <img 
                                className={classes.item}
                                src={item.photo}
                                key={item._id}
                                alt={item.title}
                                style={{ marginBottom: 30 }}
                            />
                        )
                    })
                }
                </div>
            </div> 
            ): 
            null
        }
        </>
    );
}

export default Profile;