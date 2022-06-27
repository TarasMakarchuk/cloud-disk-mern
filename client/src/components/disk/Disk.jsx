import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import FilesList from "./filesList/FilesList";
import './disk.css';
import Popup from "./Popup";
import { setCurrentDir, setPopupDisplay } from "../../reducers/fileReducer";
import Uploader from "./uploader/Uploader";

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector(state => state.files.currentDir);
  const dirStack = useSelector(state => state.files.dirStack);
  const [dragEnter, setDragEnter] = useState(false);
  const [sort, setSort] = useState('type');

  useEffect(() => {
    dispatch(getFiles(currentDir, sort));
  }, [currentDir, sort]);

  const createFolderHandler = () => {
    dispatch(setPopupDisplay('flex'));
  };

  const backHandler = () => {
    const backDirId = dirStack.pop();
    dispatch(setCurrentDir(backDirId));
  };

  const fileUploadHandler = event =>  {
    const files = [...event.target.files];
    files.forEach(file => dispatch(uploadFile(file, currentDir)));
  };

  const dragEnterHandler = event => {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  };

  const dragLeaveHandler = event => {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  };

  const dropHandler = event => {
    event.preventDefault();
    event.stopPropagation();
    let files = [...event.dataTransfer.files];
    files.forEach(file => dispatch(uploadFile(file, currentDir)));
    setDragEnter(false);
  };

  return ( !dragEnter ?
    <div className='disk' onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
      <div className="disk__btns">
        <button className="disk__back" onClick={() => backHandler()}>Back</button>
        <button className="disk__create" onClick={() => createFolderHandler()}>Create folder</button>
        <div className="disk__upload">
          <label htmlFor="disk__upload-input" className="disk__upload-label">Upload file</label>
          <input
            type="file"
            id="disk__upload-input"
            className="disk__upload-input"
            multiple={true}
            onChange={(event) => fileUploadHandler(event)}
          />
        </div>
        <select className='disk__select' onChange={e => setSort(e.target.value)} value={sort}>
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="date">Date</option>
        </select>
      </div>
      <FilesList />
      <Popup />
      <Uploader />
    </div>
      :
      <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
        Drag the download files here
      </div>
  );
};

export default Disk;
