import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Sidebar = () => {
  const name = "Sumedhav";
  const followers = 112;

  
  return (
    <>
      <div className='h-screen w-24 flex flex-col p-1 items-center justify between'>
        <div className='flex flex-col items-center'>
        <Avatar className='w-18 h-18'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h4 className='font-semibold'>{name}</h4>
        <h6>{followers}</h6>
        </div>

        <div className='flex flex-col items-center'>

        </div>
      </div>
    </>
  )
}

export default Sidebar
