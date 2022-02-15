import { Alert, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const MakeAdmin = () => {
    const [email,setEmail]=useState('');
    const[success, setSuccess]=useState(false);
    const {token}=useAuth();


    const handleAdminSubmit=(e)=>{
        const user={email}
        e.preventDefault();
        fetch('http://localhost:5000/users/admin',{
            method:"PUT",
            headers:{
                'authorization':`Bearer ${token}`,
                'content-type':'application/json'
            },
            body:JSON.stringify(user)
        }).then(res=>res.json())
        .then(data=>{
            if(data.matchedCount){
                console.log(data);
                setEmail('');
                setSuccess(true);
            }
         
        })
    }
    // on blur
    const handleOnBlur=e=> {
        setEmail(e.target.value);
    }
    return (
        <div>
            <h2>Make Me admin this Page</h2>
            <form onSubmit={handleAdminSubmit}>
                <TextField 
                 label='Email'
                 type='email'
                 onBlur={handleOnBlur}
                 variant='standard'></TextField>
                <Button variant="contained" type="submit">Make Admin</Button>
            </form>
            {success && <Alert severity='success'>Success </Alert>}
        </div>
    );
};

export default MakeAdmin;