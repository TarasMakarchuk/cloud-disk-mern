import React from 'react';
import './filesList.css';
import { useSelector } from "react-redux";
import File from "./file/File";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const FilesList = () => {
  const files = useSelector(state => state.files.files);

  return (
    <div className='file-list'>
      <div className="file-list__header">
        <div className="file-list__title">Title</div>
        <div className="file-list__date">Date</div>
        <div className="file-list__size">Size</div>
      </div>
      <TransitionGroup>
        {files.map(file =>
          <CSSTransition
            key={file._id}
            timeout={200}
            classNames='file'
            exit={false}
          >
            <File file={file}/>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default FilesList;
