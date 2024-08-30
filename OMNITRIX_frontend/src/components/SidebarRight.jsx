import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from './ui/separator'


const SidebarRight = () => {
  const repos = ["Omnitrix","Codex","CodeHive","sdfh","vsjv","bdgiudhei","dgwegdwediu","dgeiudhduie","behgd","gdgeiu","ajvdwed","hdeiu","egde",]
  return (

    <ScrollArea className="h-full w-1/5 rounded-md border flex flex-col items-center justify-evenly">
    <div className="p-4">
      <h4 className="mb-4 text-lg font-medium leading-none">Your Repositories</h4>
      {repos.map((repo) => (
        <>
          <div key={repo} className="text-md text-muted-foreground hover:text-primary  hover:cursor-pointer">
            {repo}
          </div>
          <Separator className="my-2" />
        </>
      ))}
    </div>
  </ScrollArea>

    
  )
}

export default SidebarRight
