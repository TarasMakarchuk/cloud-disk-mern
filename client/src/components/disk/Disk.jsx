import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {getFiles, uploadFile} from "../../actions/file";
import FilesList from "./filesList/FilesList";
import './disk.css';
import Popup from "./Popup";
import { setCurrentDir, setPopupDisplay } from "../../reducers/fileReducer";

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector(state => state.files.currentDir);
  const dirStack = useSelector(state => state.files.dirStack);

  useEffect(() => {
    dispatch(getFiles(currentDir));
  }, [currentDir]);

  function createFolderHandler() {
    dispatch(setPopupDisplay('flex'));
  }

  function backHandler() {
    const backDirId = dirStack.pop();
    dispatch(setCurrentDir(backDirId));
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files];
    files.forEach(file => dispatch(uploadFile(file, currentDir)));
  }

  return (
    <div className='disk'>
      <div className="disk__btns">
        <button
          className="disk__back"
          onClick={() => backHandler()}
        >
          Back
        </button>
        <button
          className="disk__create"
          onClick={() => createFolderHandler()}
        >
          Create folder
        </button>
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
      </div>
      <FilesList/>
      <Popup/>
    </div>
  );
};

export default Disk;
