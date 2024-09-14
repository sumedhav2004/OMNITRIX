import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Profile from './Profile';


const Sidebar = ({name,logged}) => {
  const firstName = name.substring(0, name.indexOf(' '));
  const followers = 112;

  
  return (
    <>
      <div className='h-screen w-24 flex flex-col p-1 items-center justify between'>
        {
          logged ? (
            <div className='flex flex-col items-center w-full'>
              <Profile />
              <h4 className='font-semibold'>{firstName}</h4>
              <h6>{followers}</h6>
            </div>
          ) : (
            <div className='flex flex-col items-center w-full'>
              <Profile />
            </div>
          )
        }

        <div className='flex flex-col items-center'>

        </div>
      </div>
    </>
  )
}

export default Sidebar;
