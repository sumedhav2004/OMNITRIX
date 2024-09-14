import { Button } from '@/components/ui/button'
import React, { useEffect, useState} from 'react'
import {Link,useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      // Replace with your backend API endpoint
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      
      localStorage.setItem('token', token);
      navigate('/'); 
      console.log('login done!')

    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  }

  return (

    <div className='w-screen h-screen flex flex-row'>
      <div className='w-1/2 h-screen flex flex-col justify-center items-center p-4'>
        <div className="w-full h-full p-2 rounded-md border border-slate-400 flex flex-col justify-center items-center gap-3">
          <h1 className="text-secondary-foreground text-5xl font-bold">
            Welcome!
          </h1>
          <h1 className='text-muted-foreground text-3xl font-bold'>Omnitrix Weilder</h1>

          <div className='w-2/3 h-2/3 border border-slate-500 rounded-md hover:border-slate-400 p-4 flex flex-col justify-center gap-8 items-center'>
            <div className='flex flex-col w-3/4 gap-1'>
              <p className='text-muted-foreground font-semibold'>Email</p>
              <input className='w-full border rounded-md h-8 p-2' type="email" placeholder="Enter your email..."
              value={email} // Bind value to state
              onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className='flex flex-col w-3/4 gap-1'>
              <p className='text-muted-foreground font-semibold'>Password</p>
              <input className='w-full border rounded-md h-8 p-2' type="password" placeholder="Enter your Password..."
              value={password} // Bind value to state
              onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className='flex flex-col w-3/4 items-center gap-1'>
              <Button onClick={handleLogin} className='w-48'>Login</Button>
            </div>

          </div>

          <p className='text-muted-foreground'>Don't have an account? 
            <Link to="/register">
            <span className='text-muted-foreground font-semibold hover:text-primary'>Register Here</span>
            </Link>
          </p>
          
          

        </div>
      </div>

      <div className='w-1/2 h-screen'>
        <img className='w-full h-full' src ="/images/login_page_cover.jpg" alt="cover" />
      </div>
 
    </div>
  )
}

export default Login;

