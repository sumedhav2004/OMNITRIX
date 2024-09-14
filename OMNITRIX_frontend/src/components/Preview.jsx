import React from 'react';
import { useState,useEffect, useCallback } from 'react';
import axios from 'axios';
import { ScrollArea } from './ui/scroll-area';

const Preview = ({ repoId, fileId }) => {
  const [fileContent, setFileContent] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [isBinaryFile, setIsBinaryFile] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFileContent = useCallback(async () => {
    if (!fileId) return; // Guard clause to prevent fetching if no fileId

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/repo/${repoId}/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { content, mimeType, encoding } = response.data;
      setMimeType(mimeType);

      if (encoding === 'base64') {
        // If it's a binary file (non-text), handle it as Base64
        setFileContent(`data:${mimeType};base64,${content}`);
        setIsBinaryFile(true);
      } else {
        // For text files, directly set the content
        setFileContent(content);
        setIsBinaryFile(false);
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  }, [fileId]); // Dependency array ensures fetch function is recreated only when repoId or fileId changes

  useEffect(() => {
    fetchFileContent();
  }, [fetchFileContent]);

  return (
    <div className='w-full h-full p-2'>
      <ScrollArea className='file-preview w-full h-[410px]'>
      {isBinaryFile ? (
        <>
          {mimeType.startsWith('image/') && (
            <img src={fileContent} alt="Preview" style={{ maxWidth: '100%' }} />
          )}

          {mimeType === 'application/pdf' && (
            <iframe src={fileContent} title="PDF Preview" width="100%" height="500px" />
          )}

          {mimeType.startsWith('audio/') && (
            <audio controls>
              <source src={fileContent} type={mimeType} />
              Your browser does not support the audio element.
            </audio>
          )}

          {mimeType.startsWith('video/') && (
            <video controls style={{ width: '100%' }}>
              <source src={fileContent} type={mimeType} />
              Your browser does not support the video tag.
            </video>
          )}

          {!['image/', 'application/pdf', 'audio/', 'video/'].some((type) => mimeType.startsWith(type)) && (
            <p>Unsupported file format for preview</p>
          )}
        </>
      ) : (
        <pre className='whitespace-pre-wrap break-words overflow-hidden max-w-full'>
          {fileContent}
        </pre>
      )}

    </ScrollArea>
    </div>

  );
};

export default Preview;

