import React from 'react';
import './file.css';
import folderImg from '../../../../assets/img/folder.svg';
import fileImg from '../../../../assets/img/file.svg';
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";

const File = ({ file }) => {
  const date = new Date(file.date).toLocaleString();
  const dispatch = useDispatch();
  const currentDir = useSelector(state => state.files.currentDir);

  function openFolderHandler() {
    dispatch(pushToStack(currentDir));
    dispatch(setCurrentDir(file._id));
  }

  return (
    <div
      className='file'
      onClick={ file.type === 'dir' ? () => openFolderHandler(): ''}
    >
      <img src={file.type === 'dir' ? folderImg : fileImg} alt="image" className="file__img"/>
      <div className="file__title">{file.name}</div>
      <div className="file__date">{date}</div>
      <div className="file__size">{file.size}</div>
    </div>
  );
};

export default File;
