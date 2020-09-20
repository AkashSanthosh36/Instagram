import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';

import {Link} from 'react-router-dom';
import {UserContext} from '../../App';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 500,
    height: 'max-content',
    margin: '26px auto',
  },
  media: {
    height: 500,
    width: 500,
    // paddingTop: '56.25%',  
  },
  textfield: {
    '& label.Mui-focused': {
        color: 'black',
      },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
      },
   },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: "black",
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


function Home(props) {
    const [data, setData] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const { state, dispatch } = useContext(UserContext)
    const classes = useStyles();

    useEffect( () => {
      fetch('/allpost', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      .then(res => res.json())
      .then(result => {
        setData(result.posts)
      })
    }, [])

    const likePost = (id) => {
      fetch('/like',{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if(item._id == result._id) {
            return result
          }
          else {
            return item
          }
        })
        setData(newData)
      })
      .catch(error => {
        console.log(error)
      })
    }

    const unlikePost = (id) => {
      fetch('/unlike',{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if(item._id == result._id) {
            return result
          }
          else {
            return item
          }
        })
        setData(newData)
      })
      .catch(error => {
        console.log(error)
      })
    }

    const makeComment = (text, postId) => {
      fetch('/comment', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: postId,
          text: text
        })
      })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if(item._id == result._id) {
            return result
          }
          else {
            return item
          }
        })
        setData(newData)
      })
      .catch(error => {
        console.log(error)
      })
    }

    const deletePost = (postId) => {
      fetch(`/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      .then(res => res.json())
      .then(result => {
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
      })
    }

    return (
        <div>
          {
            data.map(item => {
              return(
                <Card className={classes.card} key={item._id}>
                  <CardHeader
                      avatar={
                          <Avatar 
                            src={item.postedBy.pic}
                            className= "card-img"
                          />
                      }
                      action={
                          <IconButton aria-label="settings" aria-haspopup="true" onClick={ (event) => setAnchorEl(event.currentTarget)}>
                              <MoreVertIcon />
                          </IconButton>
                      }
                      title={
                        <Link to={
                          item.postedBy._id !== state._id ?
                          `/profile/${item.postedBy._id}` :
                          "/profile"
                        } 
                        style={{ textDecoration: "none", color: "black" }}
                        >
                        {item.postedBy.name}  
                        </Link>
                      }
                      // subheader="September 14, 2016"
                  />
                  
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={ () => setAnchorEl(null)}
                  >
                    <StyledMenuItem onClick={ () => deletePost(item._id) }>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Delete Post" />
                    </StyledMenuItem>
                  </StyledMenu>

                  <CardMedia>
                    <img src={item.photo} className={classes.media}/>
                  </CardMedia>
                  <CardActions>
                    {
                      item.likes.includes(state._id) ?
                      (
                        <IconButton aria-label="add to favorites" onClick={ () => unlikePost(item._id) }>
                          <FavoriteIcon style={{ color: "red" }} />
                        </IconButton>
                       ) :
                      (
                        <IconButton aria-label="add to favorites" onClick={ () => likePost(item._id) }>
                          <FavoriteBorderOutlinedIcon style={{ color: "black" }} />
                        </IconButton>
                      )  
                    }
                    <IconButton aria-label="share">
                      <ShareIcon style={{ color: "black" }}/>
                    </IconButton>
                  </CardActions>  
                  <CardContent>
                    <Typography variant="subtitle1">
                      {item.likes.length} likes
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" component="p">
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" component="p">
                      {item.body}
                    </Typography>
                    {
                      item.comments.map((record, index) => {
                        return (
                          <Typography key={index} paragraph={true}>
                            <span style={{ fontWeight: "700"}}>{record.postedBy.name}{' '}</span>  
                              {record.text}
                          </Typography>
                        )
                      })
                    }
                    <form onSubmit={(event => {
                      event.preventDefault()
                      makeComment(event.target[0].value, item._id)
                      event.target.reset()
                    })}>
                      <TextField className={classes.textfield} id="standard-basic" type="text" placeholder="Add a comment" fullWidth />
                    </form>
                  </CardContent>
            </Card>
            )
            })
          }
        </div>
    );
}

export default Home;