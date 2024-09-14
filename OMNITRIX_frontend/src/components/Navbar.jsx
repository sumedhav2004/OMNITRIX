import React, { useState,useEffect } from 'react'
import { Button } from './ui/button'
import Profile from './Profile';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios';

const Navbar = ({onLogout, logged}) => {

  const [repoName, setRepoName] = useState('');
  const token = localStorage.getItem('token');

  const createRepo = async() => {
    if(!token){
      console.log("No token found!");
      return
    }
    try{
      const res = await axios.post("http://localhost:3000/api/repo/create",
      {name: repoName},
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });



    }catch(err){
      console.log("Error occured: ",err);
    }
  }

  return (
    <nav className="flex flex-row w-full h-14 p-2 gap-4 justify-between">
      <div className=" w-2/3 flex flex-row items-center gap-8">
        <div className='flex items-center gap-2'>
          <img className="w-12" src="/images/OMNITRIX_LOGO.png" alt="logo" />
          <p className='text-3xl font-bold'>Omnitrix</p>
        </div>

        <input className='w-2/3 border border-slate-400 rounded-md h-10 p-2' placeholder='Search for other users...' />
      </div>

      <div className="flex flex-row gap-4 items-center w-1/3">
        {
          logged ? (
            <>
              <Profile className='w-8' />
              <Button variant='secondary' onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/register">
              <Button variant="secondary">
                Register
              </Button>
              </Link>


              <Link to="/login">
              <Button variant="secondary">
                Login
              </Button>
              </Link>
            </>
          )
        }
        
      </div>
    </nav>
  )
}

export default Navbar
