import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../../context/TokenContext';

/*const ApplicationCommentsList = ({ application, user }) => {
  const [comments, setComments] = useState([]);

  //fetch comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`user/comments/application/${application.id}/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    getComments();
  }, []); //will just fetch when component mounts

};*/

const ApplicationCommentsList = ({ application, user }) => {
    let navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const {token, setToken} = useContext(TokenContext)

    useEffect(() => {
      if (!token) {
        navigate("/login"); //REPLACE
      }
      else {
        // TODO: CHECK PERMISSIONS
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
    }, [user, application.id]);

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
               </div>
           </div>
         </div>
       </div>
       )
  };

export default ApplicationCommentsList;