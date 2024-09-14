
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Login from "./pages/Login"
import CreateRepo from "./pages/CreateRepo"
import Repository from "./pages/Repository"
import User from "./pages/User"
import Error404 from "./pages/Error404"
import Home from "./pages/Home"
import Register from './pages/Register';


function App() {
  return (
   <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='/create' element={<CreateRepo />} />
          <Route path='/repository/:repoId' element={<Repository />}/>
          <Route path='/user' element={<User />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </Router>
   </>
  )
}

export default App
