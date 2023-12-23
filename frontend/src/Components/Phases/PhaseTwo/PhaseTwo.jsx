import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./PhaseTwo.css"
import axios from "axios"
import { url } from "../../Constants.js";


function PhaseTwo(){
    const [isAccepted, setIsAccepted] = useState(false);
    const [acceptedSession, setAcceptedSession] = useState();
    
    const [file, setFile] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles.at(0));
    }, []);

    const { getRootProps: getRootProps, getInputProps: getInputProps } =
    useDropzone({
      onDrop: (acceptedFiles) => onDrop(acceptedFiles, 1),
      multiple: false,
    });

    const handleSubmit =()=>{
        console.log(file)

        const formData = new FormData();
        formData.append('file', file);
        formData.append('studentId', '1');
        formData.append('professorId', '1');

        axios.post(`${url}mainrequest`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => console.log(response.data))
        .catch(error => console.error('Error:', error));
    }

    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await axios.post(`${url}validate-token`, {
                token: localStorage.getItem("token"),
              });
  
              axios.get(`${url}/prerequest/student/${response.data.userId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((prerequests) => {
                console.log(prerequests)
                prerequests.data.map((prerequest)=>{
                    if(prerequest.status == 'accepted')
                    {
                        setIsAccepted(true);
                        setAcceptedSession(prerequest.sessionId);
                    }
                })
              });
            } 
            catch (err) {
              console.error(err);
            }
          };
        
          fetchData();
    },[])

    return(
        <div className="phaseTwoContainer">
            {!isAccepted
            ?
            <div>No professor accepted your request.</div>
            :
            <div className="phaseTwoWrapper">
                <div className="text">
                    {`Congratulations, you were accepted at session ${acceptedSession}`}
                </div>
                <div className="text">
                    Upload the Request paper! Your teacher will notify you if it is accepted or rejected
                </div>
                <div className="text">
                    If the request is rejected, you can upload again.
                </div>

                <div className="thesisDrop">
                    <section>
                        <div className="uploadArea" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <span>Click or Drag here</span>
                        </div>
                    </section>
                </div>

                <button onClick={handleSubmit}>Submit</button>
            </div>
            }
        </div>
    )
}

export default PhaseTwo