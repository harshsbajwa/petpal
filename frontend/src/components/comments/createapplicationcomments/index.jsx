import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplicationCommentsListCreate = ({ application, user }) => {
    let navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  //fetch comments
  useEffect(() => {
    if (!user || !user.accessToken) {
      navigate("/login"); //REPLACE
    }
    else {
      if(application.pet_seeker.user == user || application.shelter.user == user) {
          const getComments = async () => {
              try {
                const response = await axios.get(`user/comments/application/${application.id}/`, {
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                });
                setComments(response.data);
              } catch (error) {
                console.error('Error fetching comments:', error);
              }
            };
        
            getComments();
      }
      else {
          console.log("You have no access to this function");
      }
    }
  }, [user, application.id]);


  //add a new comment
  const addComment = async (e) => {
    e.preventDefault();

    if (user) {
        if (user == application.shelter.user || user == application.pet_seeker.user) {
            try {
                const response = await axios.post(`user/comments/application/${application.id}/list/`, {
                  text: newCommentText,
                  user: user.id,
                  application: application.id,
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
            console.log("You have no access to this function")
        }
    }
    else {
        navigate("/login"); //REPLACE WITH LOGIN ROUTE
    }
    
  };

  return (
    <div class="container">
     <div class="mx-auto">
        <h2 style="color: #FF5543">Application Comments</h2>
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

export default ApplicationCommentsListCreate;