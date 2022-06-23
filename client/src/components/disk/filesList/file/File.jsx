import React from 'react';
import './file.css';
import folderImg from '../../../../assets/img/folder.svg';
import fileImg from '../../../../assets/img/file.svg';

const File = ({ file }) => {
  const date = new Date(file.date).toLocaleString();
  return (
    <div className='file'>
      <img src={file.type === 'dir' ? folderImg : fileImg} alt="image" className="file__img"/>
      <div className="file__title">{file.name}</div>
      <div className="file__date">{date}</div>
      <div className="file__size">{file.size}</div>
    </div>
  );
};

export default File;
