import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RetrieveSingleComment = (comment) => {
    const [comment, setComment] = useState([]);
    //fetch comments
    useEffect(() => {
        const getComment = async () => {
        try {
            const response = await axios.get(`comments/${comment.id}/`);
            setComment(response.data);
        } catch (error) {
            console.error('Error fetching comment:', error);
        }
        };
        getComment();
    }, []);
}

export default RetrieveSingleComment;