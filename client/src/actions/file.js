import axios from "axios";
import { addFile, setFiles } from "../reducers/fileReducer";

export function getFiles (dirId) {
  return async dispatch => {
    try {
      const response = await axios.get(`http://localhost:5000/api/files${dirId ? '?parentId='+dirId : ''}`, {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      });

      dispatch(setFiles(response.data));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}

export function createFolder (dirId, name) {
  return async dispatch => {
    try {
      const response = await axios.post(`http://localhost:5000/api/files`, {
        name,
        parentId: dirId,
        type: 'dir',
      },{
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      });

      dispatch(addFile(response.data));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}

export function uploadFile (file, dirId) {
  return async dispatch => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (dirId) {
        formData.append('parentId', dirId);
      }

      const response = await axios.post(`http://localhost:5000/api/files/upload`, formData,{
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        onUploadProgress: progressEvent => {
          const totalLength = progressEvent.lengthComputable
            ?
            progressEvent.total
            :
            progressEvent.target.getResponseHeader('content-length') ||
            progressEvent.target.getResponseHeader('x-decompressed-length');

          if (totalLength) {
            let progress = Math.round((progressEvent.loaded * 100) / totalLength);
            console.log(progress);
          }
        }
      });

      dispatch(addFile(response.data));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}
