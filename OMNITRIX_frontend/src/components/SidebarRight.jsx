import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from './ui/separator'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Profile from './Profile'
import { Chat, ChatBubble } from '@mui/icons-material'


const SidebarRight = ({repos,logged,name}) => {
  const followers = 112;
  
  return (

    <div className='w-full h-screen flex flex-col items-center justify-center p-3 gap-2 bg-muted-foreground'>

        <div className='h-1/4 w-full flex flex-row p-1 items-center justify between'>
                  {
                    logged ? (
                      <>
                      <div className='flex flex-col items-center w-1/2'>
                        <Profile />
                        <h4 className='font-semibold text-white'>{name}</h4>
                        <h6 className='text-white'>{followers}</h6>
                      </div>

                      <div className='flex flex-col items-center p-2 w-1/2 border h-full gap-3 rounded-md border-white hover:border-primary hover:text-primary hover:bg-accent-foreground'>
                        <h4 className='text-white font-bold'>
                          your Chats
                        </h4>
                        <ChatBubble sx={{fontSize: 80}} />
                      </div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center w-full'>
                        <Profile />
                      </div>
                    )
                  }
                </div>

        <ScrollArea className="h-full w-[100%] rounded-md border flex flex-col items-center justify-center border-white">
            <div className="p-4 flex flex-col items-center justify-center">
              <h4 className="mb-4 text-2xl font-medium leading-none text-white">Your Repositories</h4>
              {
                  logged && repos && repos.length > 0 ? (
                    repos.map((repo) => (
                      <React.Fragment key={repo._id}>
                        <Link to={`/repository/${repo._id}`}>
                          <div className="text-md text-white hover:text-primary hover:font-semibold hover:cursor-pointer">
                            {repo.name}
                          </div>
                        </Link>
                        <Separator className="my-2 bg-white" />
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No repositories available</p>
                  )
                }
            </div>
          </ScrollArea>

    </div>

    
  )
}

export default SidebarRight
