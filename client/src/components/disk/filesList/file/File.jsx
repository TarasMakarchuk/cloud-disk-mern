import React from 'react';
import './file.css';
import folderImg from '../../../../assets/img/folder.svg';
import fileImg from '../../../../assets/img/file.svg';
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";
import sizeFormat from "../../../../utils/file/sizeFormat";

const File = ({ file }) => {
  const date = new Date(file.date).toLocaleString();
  const dispatch = useDispatch();
  const currentDir = useSelector(state => state.files.currentDir);
  const fileView = useSelector(state => state.files.view);

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

  if (fileView === 'list') {
    return (
      <div
        className='file'
        onClick={() => openFolderHandler(file)}
      >
        <img src={file.type === 'dir' ? folderImg : fileImg} alt="" className="file__img"/>
        <div className="file__title">{file.name}</div>
        <div className="file__date">{date}</div>
        <div className="file__size">{file.type === 'dir' ? '' : sizeFormat(file.size)}</div>
        {
          file.type !== 'dir' &&
          <button
            className='file__btn file__download'
            onClick={(event) => downloadClickHandler(event)}
          >
            Download
          </button>
        }
        <button
          className='file__btn file__delete'
          onClick={(event) => deleteClickHandler(event)}
        >
          Delete
        </button>
      </div>
    );
  }

  if (fileView === 'plate') {
    return (
      <div
        className='file-plate'
        onClick={() => openFolderHandler(file)}
      >
        <img src={file.type === 'dir' ? folderImg : fileImg} alt="" className="file-plate__img"/>
        <div className="file-plate__title">{file.name}</div>
        <div className="file-plate__btns">
          {
            file.type !== 'dir' &&
            <button
              className='file-plate__btn file__download'
              onClick={(event) => downloadClickHandler(event)}
            >
              Download
            </button>
          }
          <button
            className='file-plate__btn file__delete'
            onClick={(event) => deleteClickHandler(event)}
          >
            Delete
          </button>
        </div>

      </div>
    );
  }


};

export default File;
