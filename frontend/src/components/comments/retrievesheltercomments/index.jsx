import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './comments.css';

const ShelterCommentsList = (shelter) => {
    const [comments, setComments] = useState([]);

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
    }, []);

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
            </div>
        </div>
      </div>
    </div>
    )
}

export default ShelterCommentsList;