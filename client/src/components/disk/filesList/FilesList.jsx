import React from 'react';
import './filesList.css';
import { useSelector } from "react-redux";
import File from "./file/File";

const FilesList = () => {
  const files = useSelector(state => state.files.files)
    .map(file => <File key={`${file._id}`} file={file} />);

  return (
    <div className='file-list'>
      <div className="file-list__header">
        <div className="file-list__title">Title</div>
        <div className="file-list__date">Date</div>
        <div className="file-list__size">Size, bytes</div>
      </div>
      {files}
    </div>
  );
};

export default FilesList;
