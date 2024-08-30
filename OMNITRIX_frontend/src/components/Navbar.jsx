import React, { useState } from 'react'
import { Button } from './ui/button'
import Profile from './Profile';


const Navbar = () => {
  const login = false;

  return (
    <nav className="flex flex-row w-full h-18 gap-4 justify-between">
      <div className="flex flex-row items-center gap-4">
        <img className="w-16" src="/images/OMNITRIX_LOGO.png" alt="logo" />
        <p className='text-3xl font-bold'>Omnitrix</p>
      </div>

      <div className="flex flex-row gap-3 items-center">
        {
          login ? (
            <Profile />
          ) : (
            <>
              <Button variant="secondary">Register</Button>
              <Button variant="secondary">Login</Button>
            </>
          )
        }
        <Button>Create new Repo</Button>
      </div>
    </nav>
  )
}

export default Navbar
