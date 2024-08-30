import SidebarLeft from "./components/SidebarLeft"
import { Button } from "./components/ui/button"
import Navbar from "./components/Navbar"
import { Separator } from "./components/ui/separator"
import SidebarRight from "./components/SidebarRight"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Auth from "./pages/Auth"
import CreateRepo from "./pages/CreateRepo"
import Repository from "./pages/Repository"
import User from "./pages/User"
import Error from "./pages/Error"


function App() {
  return (
   <>
      <Router>
        <div className="flex flex-col p-2 gap-1 w-full h-screen ">
          <Navbar />
          <Separator />
          <div className="flex flex-row p-2 gap-4 w-full h-screen">
            <SidebarLeft />
            <Separator orientation="vertical" />
            <div className="flex flex-col p-1 gap-8 items-center justify-evenly">
              <p className="text-muted-foreground text-6xl font-bold">
              Welcome, fellow plummers!         
              </p>
              <p className="text-muted-foreground text-5xl font-bold">
                The <span className="text-primary">Omnitrix</span> awaits you.
              </p>

              <img className="w-96 h-84" src ="/images/cover_image2.png" alt="cover" style={{ background: 'none' }} />
              <Button className="w-48 h-12 text-xl">Create new Repo</Button>  
            </div>

            <Separator orientation="vertical" />
            <SidebarRight />
          </div>

          <Separator />

            <div className="flex flex-col p-2 gap-4 w-full h-screen justify-evenly items-center">
              <p className="text-muted-foreground text-7xl font-bold">What we Offer</p>
            </div>
        </div>


        <Routes>
          <Route path='/auth' element={<Auth />} />
          <Route path='/create' element={<CreateRepo />} />
          <Route path='/repository' element={<Repository />}/>
          <Route path='/user' element={<User />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </Router>
   </>
  )
}

export default App
