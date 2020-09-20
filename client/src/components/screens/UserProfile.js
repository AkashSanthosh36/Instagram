import React, { useEffect, useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import {useParams} from 'react-router-dom'

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
        // background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
        // color: 'white',
        textTransform: 'none',
    },
}));

function Profile(props) {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const classes = useStyles();

    useEffect( () => {
        fetch(`/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        })
        .then(res => res.json())
        .then(result => {
            setUserProfile(result)
        })
    }, [userId])

    const followUser = () => {
        fetch('/follow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                followId: userId    // see useparams
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch({ type: "UPDATE", payload: {following: data.following, followers: data.followers} })
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile( (prevState) => {
                return {
                    ...prevState,
                    user: { 
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id] 
                    }
                }
            })
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                unfollowId: userId    // see useparams
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch({ type: "UPDATE", payload: {following: data.following, followers: data.followers} })
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile( (prevState) => {
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return {
                    ...prevState,
                    user: { 
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
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
                </div>
                <div>
                    <Typography variant="h4" style={{ marginTop: "20px" }}>{userProfile.user.name}</Typography>
                    <div style={{ display: "flex", justifyContent: "space-between" , width: "108%" }}>
                        <Typography variant="h6">{userProfile.posts.length} Posts</Typography>
                        <Typography variant="h6">{userProfile.user.followers.length} Followers</Typography>
                        <Typography variant="h6">{userProfile.user.following.length} Following</Typography>
                    </div>
                    {
                        userProfile.user.followers.includes(state._id) ?
                        (
                            <Button className={classes.button} onClick={unfollowUser} size="small" variant="contained" color="primary">
                                <Typography>
                                    Unfollow
                                </Typography>
                            </Button>
                        ) :
                        (
                            <Button className={classes.button} onClick={followUser} size="small" variant="contained" color="primary">
                                <Typography>
                                    Follow
                                </Typography>
                            </Button>
                        )
                    }    
                </div>
            </div>
            <Divider style={{ marginBottom: 30}}/>
            <div className={classes.gallery}>
                {
                    userProfile.posts.map(item => {
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
            <Typography variant="h2">Loading...</Typography>
        }
        </>
    );
}

export default Profile;