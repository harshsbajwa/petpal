import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const ShelterCommentsListCreate = ({ shelter, user }) => {
let navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  //fetch comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`user/comments/shelter/${shelter.id}/list/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    getComments();
  }, []); //just fetch when component mounts


  //add a new comment
  const addComment = async (e) => {
    e.preventDefault();

    if( user) {
        try {
            const response = await axios.post(`user/comments/shelter/${shelter.id}/`, {
              text: newCommentText,
              user: user.id,
              shelter: shelter.id,
              created_at: new Date(),
            }, {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            });
      
            setComments([...comments, response.data]);
            setNewCommentText('');
          } catch (error) {
            console.error('Error adding comment:', error);
          }
    }
    else {
        navigate("/login"); // REPLACE WITH LOGIN ROUTE
    }
  };

  return (
    <div class="container">
     <div class="mx-auto">
       <h2 style="color: #FF5543">Hear what our customers have to say!</h2>
       <div> 
           <div class="row justify-content-center">
           <ul>
               {comments.map((comment) => (
               <li key={comment.id}>
               <div class="col-4">
                   <p>User: {comment.user.id}  <br />
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
       </div>
     </div>
   </div>
   )
}; 

export default ShelterCommentsListCreate;