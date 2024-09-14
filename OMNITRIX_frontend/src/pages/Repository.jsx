import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Profile from '@/components/Profile'
import { Chat, ChatBubble } from '@mui/icons-material'
import Preview from '@/components/Preview'

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
} from "@/components/ui/alert-dialog"
import DragAndDrop from '@/components/DragAndDrop'



const Repository = () => {
  const { repoId } = useParams(); // Fetching the repoId from the URL
  const [commitData, setCommitData] = useState({commits:[]});
  const [username,setUsername] = useState('');
  const [hash, setHash] = useState('');
  const [repoData,setRepoData] = useState({});
  const [repofiles,setRepoFiles] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [userId, setUserId] = useState('');
  const [commitmessage,setCommitMessage] = useState('');

  const followers = 112;
  const token = localStorage.getItem('token');
    console.log(token);
  
  const fetchUserData = async () => {
    if (!token) {
      console.error("No token found, redirecting to login...");
     // Or use your routing library
      return;
    }
    
    try {
      const response = await axios.get("http://localhost:3000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const userData = response.data;
      console.log(userData);

      setUsername(userData.name);
      setUserId(userData._id)
    } catch (error) {
      console.error("Error happened: ", error);
    }
  }

  const handleRevert = async (commitHash) => {
    if (!token || !commitHash) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/repo/revert",
        { repoId, commitHash },  // Use commitHash directly here
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Revert success:", response.data);
    } catch (error) {
      console.error("Error reverting commit: ", error);
    }
  };
  


  const handleFileChange = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    setSelectedFile(files[0]);
  };

  // Handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  // Handle drag leave event
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  // Handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileChange(event); // Call the file change handler for dropped files
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.log("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`http://localhost:3000/api/repo/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };


//Commiting changes to the repo.
  const CommitChanges = async () => {
    if (!token) {
      console.log("No token found!");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/repo/commit",
        { repoId:repoId, message:commitmessage },  // Data body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authorization
          },
        }
      );
      console.log("Commit successful:", response.data);
    } catch (error) {
      console.error("Error committing changes:", error.response?.data || error.message);
    }
  };
  

//Repository details
  const fetchRepoDetails = async() => {
    try{
        if (!token) {
          console.log("No token Found, Something went wrong.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/repo/repos/${repoId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRepoData(response.data);
        

    }catch(err){
      console.log("Server Error: ",err);
    }
  }



  useEffect(() => {
    if (repoData.files) {
      setRepoFiles(repoData.files);
    }
  }, [repoData]);



  useEffect(() => {
    const fetchCommitData = async () => {
      try {
        
        if (!token) {
          console.log("No token Found, Something went wrong.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/repo/repos/${repoId}/commits`,
          {
            // params:{repoId, userId},
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setCommitData(response.data);
        console.log(commitData); // Set the fetched data to state

      } catch (error) {
        console.log("Something went wrong, Server Error: ", error);
      }
    };

    fetchCommitData();
    fetchUserData();
    fetchRepoDetails();
  }, [repoId]);



  const fetchFileContent = async (fileId) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/repo/${repoId}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFileId(fileId); 
    } catch (error) {
      console.error("Error fetching file content: ", error);
    }
  };



  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <Navbar logged={true} />
      <Separator className='bg-slate-700' />


      <div className='w-full h-full flex flex-row items-center justify-center'>
      <div className='w-full h-full flex flex-row items-center justify-center rounded-lg'>
            <div className='w-2/3 h-full flex flex-col items-center justify-center relative z-10 p-4'>
              <div className='w-full h-full flex flex-col items-center justify-start p-2 bg-white border rounded-md border-muted-foreground'>
              <h4 className='text-muted-foreground font-bold text-4xl'>{repoData.name}</h4>

              <Separator className='bg-slate-500' />

                <div className='w-full h-full flex flex-row p-2 gap-2'>

                  <div className='w-1/3 h-full flex flex-col items-center justify-center gap-2'>
                  <ScrollArea className='w-full h-full flex flex-col items-center justify-center p-1 gap-2'>
                    {
                      repofiles.map((file)=>(
                        <React.Fragment key={file._id}>
                        <div onClick={() => fetchFileContent(file._id)} className=" flex flex-col items-center cursor-pointer h-10">
                          <h4>{file.name}</h4>
                        </div>
                        <Separator />
                      </React.Fragment>
                      ))
                    }
                  </ScrollArea>
                  </div>
                  
                  <Separator orientation='vertical'  className='bg-slate-600 h-[428px]' />

                  {
                    fileId ? (
                      <div className='w-2/3 h-full'>
                        <Preview repoId={repoId} fileId={fileId} />
                      </div>
                    ) : (
                      <div className='w-2/3 h-full'>
                        <DragAndDrop />
                      </div>
                    )
                  }

                </div>

                  <Separator className='bg-slate-700' />

                  <div className='w-full flex flex-row items-center justify-between gap-5 p-2'>
                  <AlertDialog>
                    <AlertDialogTrigger className='bg-primary text-white w-36 rounded-md h-10'>Commit Changes</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Add the commit message</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.. {'\n'}
                          Click below to write your commit message.
                        </AlertDialogDescription>
                        <input type="text" className='h-12 w-full rounded-md border-slate-800' onChange={(e)=>setCommitMessage(e.target.value)} />
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>
                          <Button onClick={CommitChanges}>Commit</Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className='flex gap-10'>
                  <Button variant='secondary' className=''>Upload File</Button>

                  <Button variant='secondary'>Upload directory</Button>
                  </div>
                  </div>

              </div>

            </div>

            <Separator orientation='vertical' />

            <div className='w-1/3 h-full flex flex-col items-center justify-center p-4 bg-muted-foreground gap-2'>

                  <div className='w-full flex flex-row items-center justify-center h-1/3'>
                  <div className='flex flex-col items-center w-1/2'>
                        <Profile />
                        <h4 className='font-semibold text-white'>{username}</h4>
                        <h6 className='text-white'>{followers}</h6>
                      </div>

                      <div className='flex flex-col items-center p-2 w-1/2 border h-full gap-3 rounded-md border-white hover:border-primary hover:text-primary hover:bg-accent-foreground'>
                        <h4 className='text-white font-bold'>
                          Your Chats
                        </h4>
                        <ChatBubble sx={{fontSize: 80}} />
                      </div>
                  </div>


              <ScrollArea className='w-full h-full flex flex-col items-center justify-center border border-white rounded-lg p-4 gap-2'>
                <h4 className='w-full text-xl font-bold text-white flex items-center justify-center'>Commits</h4>

                <Separator className='bg-white' />
                <div className='w-full h-full flex flex-col gap-2 items-center justify-center '>
                  {
                      commitData.commits.map((commit) => (
                        <div className='w-full flex flex-row items-center justify-center border border-white rounded-md' key={commit._id}>
                          <div className='w-2/3 flex flex-col items-center justify-center'>
                              {console.log(commit)}
                              <h4 className='text-white text-lg font-bold'>{commit.message}</h4>
                              <p className='text-white'>{(commit.date).slice(0,10)}
                                {' '}
                                <span>
                                  {(commit.date).slice(11,16)}
                                </span>
                              </p>
                          </div>
                          <div className='w-1/3 flex flex-col items-center justify-center'>
                            <Button onClick={() => handleRevert(commit.hash)} variant='destructive'>
                              Revert
                            </Button>

                          </div>

                        </div>
                      ))
                  }

                </div>
              </ScrollArea>
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default Repository
