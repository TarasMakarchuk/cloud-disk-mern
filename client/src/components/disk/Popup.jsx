import React, { useState } from 'react';
import Input from "../../utils/input/Input";
import { useDispatch, useSelector } from "react-redux";
import { setPopupDisplay} from "../../reducers/fileReducer";
import { createFolder } from "../../actions/file";

const Popup = () => {
  const [folderName, setFolderName] = useState('');
  const popupDisplay = useSelector(state => state.files.popupDisplay);
  const currentDir = useSelector(state => state.files.currentDir);
  const dispatch = useDispatch();

  const createHandler = () => {
    dispatch(createFolder(currentDir, folderName));
    dispatch(setPopupDisplay('none'));
    setFolderName('');
  };

  return (
    <div
      className='popup'
      onClick={() => dispatch(setPopupDisplay('none'))}
      style={{display: popupDisplay}}
    >
      <div
        className="popup__content"
        onClick={e => e.stopPropagation()}
      >
        <div className="popup__header">
          <div className="popup__title">Create a new folder</div>
          <button
            className="popup__close"
            onClick={() => dispatch(setPopupDisplay('none'))}
          >X</button>
        </div>
        <Input
          type="text"
          placeholder="Enter a folder title ..."
          value={folderName}
          setValue={setFolderName}
        />
        <button
          className="popup__create"
          onClick={() => createHandler()}
        >Create</button>
      </div>
    </div>
  );
};

export default Popup;
