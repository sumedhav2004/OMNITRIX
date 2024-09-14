import React from 'react'
import { Avatar,AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Link } from 'react-router-dom'


const Profile = () => {


  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Link to='/user'>
        <Avatar className='w-18 h-14'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      
    </div>
  )
}

export default Profile
