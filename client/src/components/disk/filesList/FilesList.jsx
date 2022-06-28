import React from 'react';
import './filesList.css';
import { useSelector } from "react-redux";
import File from "./file/File";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const FilesList = () => {
  const files = useSelector(state => state.files.files);
  const fileView = useSelector(state => state.files.view);

  if (!files.length) {
    return (
      <div className='loader'>Files not found</div>
    );
  }

  if (fileView === 'plate') {
    return (
      <div className='file-plate-list'>
        {files.map(file =>
          <File key={file._id} file={file}/>
        )}
      </div>
    );
  }

  if (fileView === 'list') {
    return (
      <div className='file-list-list'>
        <div className="file-list-list__header">
          <div className="file-list-list__title">Title</div>
          <div className="file-list-list__date">Date</div>
          <div className="file-list-list__size">Size</div>
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
  }
};

export default FilesList;
