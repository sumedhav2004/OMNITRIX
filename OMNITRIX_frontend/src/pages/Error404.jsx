import React from 'react'

const Error = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center gap-4'>
      <h1 className='text-muted-foreground font-semibold text-4xl'>
        Oops! Something went wrong.
      </h1>
      <img className='w-96 h-96' src ="/images/vilgax.png" alt="cover" style={{ background: 'none' }} />
      
    </div>
  )
}

export default Error
