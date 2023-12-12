import axios from "axios";
import { useContext, useState } from "react";

const ShelterBlog = (shelter) => {
    const [blogPosts, setBlogPost] = useState({});
    const [newBlogPostText, setNewBlogPostText] = useState({})


    const validateForm = event =>{
            const payload = {
                "shelter": shelter,
                "created_at": new Date(),
                // "text": text,
            }
            let token = "";

            axios.post(`shelter/${shelter.id}/blog/`, payload)
            .then(response => {
                setBlogPost([...blogPosts, response.data]);
                setNewBlogPostText('');              
            })
            .catch(error => {
                console.log(error.response.data)
            });
    
    }
    
    return(
    <div class="container">
     <div class="mx-auto">
        <h2 style="color: #FF5543">Our Shelter's Blog</h2>
       <div> 
           <div class="row justify-content-center">
           <ul>
               {blogPosts.map((blogpost) => (
               <li key={blogpost.id}>
               <div class="col-4">
                   <p>{blogpost.created_at} </p>
               </div>
               <div class="col-6">
                   <p>{blogpost.text}</p>
               </div>
               </li>
               ))}
           </ul>
           <form /*</div>onSubmit={validateForm}*/> 
                <label>
                Add Blogpost:
                <input
                    type="text"
                    value={newBlogPostText}
                    onChange={(e) => setNewBlogPostText(e.target.value)}
                />
                </label>
                <button type="submit">Create Post</button>
            </form>
           </div>
       </div>
     </div>
   </div>
    )
}

export default ShelterBlog;