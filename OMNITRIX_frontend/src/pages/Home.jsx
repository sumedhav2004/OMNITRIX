import React, { useState, useEffect } from 'react';
import SidebarLeft from "../components/SidebarLeft";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { Separator } from "../components/ui/separator";
import SidebarRight from "../components/SidebarRight";
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Home = () => {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [shouldFetchRepos, setShouldFetchRepos] = useState(true);

  const token = localStorage.getItem('token');
  console.log(token);

  useEffect(() => {
    if (token) {
      setIsLogged(true);
    }
  }, [token]);

  const createRepo = async () => {
    if (!token) {
      console.log('No token found!');
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:3000/api/repo/create',
        { name: repoName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShouldFetchRepos(true); // Trigger repo fetch after creating the repo
    } catch (err) {
      console.log('Error occurred: ', err);
    }
  };

  const fetchUserData = async () => {
    if (!token) {
      console.error('No token found, redirecting to login...');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      console.log(userData);

      setUsername(userData.name);
    } catch (error) {
      console.error('Error happened: ', error);
    }
  };

  const fetchRepos = async () => {
    if (!token) {
      console.log('No token found!');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/api/repo/repos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userRepos = response.data;
      console.log(userRepos);
      setRepos(userRepos);
      setShouldFetchRepos(false); // Reset after fetching repos
    } catch (error) {
      console.log('Error occurred: ', error);
    }
  };

  useEffect(() => {
    if (shouldFetchRepos) {
      fetchRepos();
    }
  }, [shouldFetchRepos]); // Use shouldFetchRepos in dependency array

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    setRepos([]);
  };

  useEffect(() => {
    fetchUserData();
    fetchRepos();
  }, []);

  return (
    <div className="flex flex-col p-2 gap-1 w-full h-full">
      <Navbar onLogout={handleLogout} logged={isLogged} />
      <Separator />
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col p-1 gap-8 items-center justify-evenly w-2/3">
          <div>
            <p className="text-muted-foreground text-6xl font-bold">Welcome, fellow plummers!</p>
            <p className="text-muted-foreground text-5xl font-semibold">
              The <span className="text-primary">Omnitrix</span> awaits you.
            </p>
          </div>

          <img
            className="w-96 h-84"
            src="/images/cover_image2.png"
            alt="cover"
            style={{ background: 'none' }}
          />
          <AlertDialog>
            <AlertDialogTrigger className="bg-primary text-white w-72 rounded-md h-10 text-sm">
              Create new Repo
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>The name of your repository</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.. {'\n'}
                  Click below to write your repository name.
                </AlertDialogDescription>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border-slate-800"
                  onChange={(e) => setRepoName(e.target.value)}
                />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button onClick={createRepo}>Create new Repo</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator orientation="vertical" />

        <div className="w-1/3 h-screen flex flex-col p-2">
          <SidebarRight repos={repos} logged={isLogged} name={username} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col p-2 gap-4 w-full h-screen justify-evenly items-center">
        <p className="text-muted-foreground text-7xl font-bold">What we Offer</p>
      </div>
    </div>
  );
};

export default Home;

