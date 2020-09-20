import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../App'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Grand Hotel, cursive',
    fontSize: 40,
  },
  button: {
    textTransform: 'none',
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
   }, 
}));

function Navbar(props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const {state, dispatch} =  useContext(UserContext) 
    const history = useHistory()
    const classes = useStyles()  
    
    const fetchUsers = (query) => {
      setSearch(query)
      fetch('/search-users', {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          query: query
        })
      })
      .then(res => res.json())
      .then(results => {
        setUserDetails(results.user)
      })
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setSearch('')
      setUserDetails([])
    };

    const renderList = () => {
      if(state) {
        return [
          <Button key={1} className={classes.button} color="inherit" onClick={handleClickOpen}><Typography>Search Users</Typography></Button>,
          <Button key={2} className={classes.button} color="inherit" component={Link} to="/profile"><Typography>Profile</Typography></Button>,
          <Button key={3} className={classes.button} color="inherit" component={Link} to="/createpost"><Typography>Create Post</Typography></Button>,
          <Button key={4} className={classes.button} color="inherit" component={Link} to="/followedusersposts"><Typography>Followed Users Post</Typography></Button>,
          <Button 
            key={5}
            className={classes.button} 
            color="inherit"  
            onClick={ () => {
              localStorage.clear()
              dispatch({type: "CLEAR"})
              history.push('/signin')
            }}
          >
            <Typography>
              Logout
            </Typography>
          </Button>
        ]
      }
      else {
        return [
          <Button key={6} className={classes.button} color="inherit" component={Link} to="/signin"><Typography>Signin</Typography></Button>,
          <Button key={7} className={classes.button} color="inherit" component={Link} to="/signup"><Typography>Signup</Typography></Button>
        ]
      }
    } 

    return (
        <div className={classes.root}>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Link to={state ? '/' : '/signin'} style={{ textDecoration: "none", color: "black" }}>
                            Instagram
                        </Link>
                    </Typography>
                    {renderList()}
                </Toolbar>
            </AppBar>

            <Dialog open={open} scroll="paper" onClose={handleClose} fullWidth aria-labelledby="form-dialog-title">
              
              <DialogTitle id="form-dialog-title">
                <TextField
                  className={classes.textfield}
                  placeholder="Search..."
                  id="outlined-start-adornment"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  }}
                  variant="outlined"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  value={search}
                  onChange = {(event) => fetchUsers(event.target.value)}
                />
              </DialogTitle>

              <DialogContent>
              <List dense className={classes.root}>
                  {userDetails.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value._id}`;
                    return (
                        <ListItem 
                          key={value._id} 
                          button
                          onClick={ () => {
                            handleClose()
                            history.push( value._id !== state._id ? `/profile/${value._id}` : '/profile')
                            }
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={`Avatar n°${value._id + 1}`}
                              src={value.pic}
                            />
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={value.name} />
                        </ListItem>
                    );
                  })}
                </List>
              </DialogContent>
              
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
        </div>
    );
}

export default Navbar;
