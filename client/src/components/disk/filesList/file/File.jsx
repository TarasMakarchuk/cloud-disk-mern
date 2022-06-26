import React from 'react';
import './file.css';
import folderImg from '../../../../assets/img/folder.svg';
import fileImg from '../../../../assets/img/file.svg';
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";

const File = ({ file }) => {
  const date = new Date(file.date).toLocaleString();
  const dispatch = useDispatch();
  const currentDir = useSelector(state => state.files.currentDir);
  const formatFileSize = new Intl.NumberFormat("us", {style: "decimal"}).format(file.size);

  const openFolderHandler = file => {
    if (file.type === 'dir') {
      dispatch(pushToStack(currentDir));
      dispatch(setCurrentDir(file._id));
    }
  };

  const downloadClickHandler = event => {
    event.stopPropagation();
    downloadFile(file);
  };

  const deleteClickHandler = event => {
    event.stopPropagation();
    dispatch(deleteFile(file));
  };

  return (
    <div
      className='file'
      onClick={() => openFolderHandler(file)}
    >
      <img src={file.type === 'dir' ? folderImg : fileImg} alt="" className="file__img"/>
      <div className="file__title">{file.name}</div>
      <div className="file__date">{date}</div>
      <div className="file__size">{formatFileSize}</div>
      {file.type !== 'dir' &&
      <button
        className='file__btn file__download'
        onClick={(event) => downloadClickHandler(event)}
      >
        Download
      </button>}
      <button
        className='file__btn file__delete'
        onClick={(event) => deleteClickHandler(event)}
      >
        Delete
      </button>
    </div>
  );
};

export default File;
