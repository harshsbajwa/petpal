import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenContext } from '../../../context/TokenContext';

const ApplicationCommentsListCreate = () => {
  let navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const {token, setToken} = useContext(TokenContext);

  const { params } = useParams();
  const queryParams = new URLSearchParams(params);
  const applicationID = queryParams.get('application');
  const shelterID = queryParams.get('shelter');
  const seekerID = queryParams.get('seeker');
  const petID = queryParams.get('pet');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentsPerPage] = useState(2);
  let listURL = `http://localhost:8000/user/comments/application/${applicationID}/list/`;

  //fetch comments
  useEffect(() => {
    const getComments = async () => {
      try {
          if (currentPage != 1) {
            listURL += `?page=${currentPage}`;
          } 

          const response = await axios({
              method: "GET",
              url: listURL,
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });
          console.log(response.data);
          setComments(response.data.results);
          setTotalPages(Math.ceil(response.data.count / commentsPerPage));
      } catch (error) {
          console.log(error);
      }
    }
    getComments();
  }, [currentPage]);

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/user/comments/application/${applicationID}/`, {
        text: newCommentText,
        user: seekerID,
        application: applicationID,
        created_at: new Date(),
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
  
      setComments([...comments, response.data]);
      setNewCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  return (
    <div className="container mt-5">
     <div class="mx-auto">
        <h2 style={{color: '#FF5543'}}>Application Comments</h2>
       <div> 
           <div class="row justify-content-center">
           <ul>
               {comments.map((comment) => (
               <li key={comment.id}>
               <div class="col-4">
                   <p>User: {comment.user}  <br />
                   Created at:</p> {comment.created_at}
               </div>
               <div class="col-6">
                   <p>Comment:</p> {comment.text}
               </div>
               </li>
               ))}
           </ul>
           <form onSubmit={addComment}> 
                <label>
                Add Comment:
                <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                />
                </label>
                <button type="submit">Submit Comment</button>
            </form>
           </div>
           <div class="text-center mt-4">
                { currentPage > 1
                    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage - 1)}} >Previous Page</button>
                    : <></> }
                { currentPage < totalPages
                    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage + 1)}} >Next Page</button>
                    : <></> }
                <p>Page {currentPage} out of {totalPages}.</p>
            </div>
       </div>
     </div>
   </div>
   )
}; 

export default ApplicationCommentsListCreate;