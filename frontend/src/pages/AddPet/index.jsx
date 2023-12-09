import { useContext, useState } from 'react';
import styles from './add-pet-styles.css'; // Import CSS module
const AddPet = (props) => {
    const [name, setName] = useState("");
    const [nError, setNerror] = useState(false);
    const [breed, setBreed] = useState("");
    const [bError, setBerror] = useState(false);
    const [age, setAge] = useState();
    const [aError, setAerror] = useState(false);
    const [gender, setGender] = useState("Male");
    const [size, setSize] = useState("");
    const [desc, setDesc] = useState("");
    const [med, setMed] = useState("");
    const [behave, setBehave] = useState("");
    const [needs, setNeeds] = useState("");
    const [formError, setFormerror] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");


    const addNewPet = () => {
        // Creating a new pet object (in this case, just a placeholder object)
        const newPet = {
            "name": name,
            "about": desc,
            "breed": breed,
            "age": age,
            "gender": gender,
            "size": size,
            "status": "Available"
          }
    
        // Modifying the petList using the setPetList function from the context
        props.addPet(newPet); // Adding the new pet to the existing petList
      };
    

    const validateName = event => {
        const value = event;
        setName(value)
        if (/\W/.test(value) || value.length < 1){
            setNerror(true);
        }
        else{
            setNerror(false);
        }
    }
    const validateBreed = event => {
        const value = event;
        setBreed(value)
        if (/\W/.test(value) || value.length < 1){
            setBerror(true);
        }
        else{
            setBerror(false);
        }
    }
    const validateAge = event => {
        const value = event;
        setAge(value);
        if (value <= 0){
            setAerror(true);
        }
        else{
            setAerror(false);
        }

    }
    
    const validateForm = event =>{
        validateName(name);
        validateBreed(breed);
        validateAge(age);

        if (nError || bError || aError){
            setFormerror(true); 
        }
        else{
            setFormerror(false);
            addNewPet();
            props.togglePopup();
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="border bg-white shadow box-area row">
            <div className="title w-100">PetPal</div>
            <div className="mb-4 subtitle w-100">Add A Pet To Your Shelter:</div>
                <div className="left col-md-6">                
                    <div className="mb-3 pr-0">
                        <label htmlFor="petName" className="form-label">Pet Name</label>
                        <input type="fname" className={nError?"form-control error-label":"form-control"} id="petName" name="petname" autoComplete="given-name" 
                        onChange={(event)=>validateName(event.target.value)} 
                        onClick={(event)=>validateName(event.target.value)} 
                        />
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="breedInput" className="form-label" >Pet Breed</label>
                        <input type="text" className={bError?"form-control error-label":"form-control"} id="breedInput" name="breedinput" 
                        onChange={(event)=>validateBreed(event.target.value)} 
                        onClick={(event)=>validateBreed(event.target.value)} 
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputAge">Age</label>
                            <input type="number" className={aError?"form-control error-label":"form-control"} 
                            onChange={(event)=>validateAge(event.target.value)} 
                            onClick={(event)=>validateAge(event.target.value)}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputGender">Gender</label>
                            <select type="text" className="form-control" id="inputGender" name="inputGender"
                            onChange={(event)=>setGender(event.target.value)} 
                            onClick={(event)=>setGender(event.target.value)}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputSize">Size</label>
                            <input type="number" className="form-control" id="inputSize" placeholder="" 
                            onChange={(event)=>setSize(event.target.value)} 
                            onClick={(event)=>setSize(event.target.value)}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descInp" className="mb-2">Description</label>
                        <textarea className="form-control preferences" id="descInp" rows="2"
                        onChange={(event)=>setDesc(event.target.value)} 
                        onClick={(event)=>setDesc(event.target.value)}
                        ></textarea>
                    </div>     
                </div>
                <div className="right col-md-6">
                    <div className="mb-3">
                        <label htmlFor="medInp" className="mb-2">Medical History</label>
                        <textarea className="form-control preferences" id="medInp" rows="2"
                        onChange={(event)=>setMed(event.target.value)} 
                        onClick={(event)=>setMed(event.target.value)}
                        ></textarea>
                    </div>                      
                    <div className="mb-3">
                        <label htmlFor="behaveInp" className="mb-2">Behaviour</label>
                        <textarea className="form-control preferences" id="behaveInp" rows="2"
                        onChange={(event)=>setBehave(event.target.value)} 
                        onClick={(event)=>setBehave(event.target.value)}
                        ></textarea>
                    </div>      
                    <div className="mb-3">
                        <label htmlFor="needsInp" className="mb-2">Special Needs or Requirements</label>
                        <textarea className="form-control special" id="needsInp" rows="2"
                        onChange={(event)=>setNeeds(event.target.value)} 
                        onClick={(event)=>setNeeds(event.target.value)}
                        ></textarea>
                    </div>     
                </div>
                <div className="input-group mb-3"> 
                    <label htmlFor="inputGroupFile01" className="w-100 mb-2"> Upload a Picture Of Your Pet</label>
                    <input type="file" className="form-control" id="inputGroupFile01" /> 
                </div> 
                <img className="img-fluid ppic mb-4" src="images/dog.jpg" />
                <div className="input-group mb-3 row align-items-center">
                    <div className=" col-md-6 w-auto" >
                       <button type="submit" className="btn btn-primary cancel fs-6" onClick={()=>props.togglePopup()}>Cancel</button>
                    </div>
                    <div className="col-md-6 w-auto">
                        <button type="submit" className="btn btn-primary fs-6"
                        onClick={() => validateForm()}
                        >Add Pet</button>
                     </div>
                     {/* {formError?<ul>{Object.keys(requestMessage).map(message=><li key={message}>{message}: {requestMessage[message]}</li>)}</ul>:<></>} */}
                </div>
        </div>
    </div> 
    )
}
export default AddPet;