import { useState, useEffect } from "react";
import { Form, Button, ListGroup, Badge, Modal } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector} from 'react-redux'
import { toast } from "react-toastify";
import { useRequestMutation, useFetchPendingMutation, useUpdateRequestMutation } from "../slices/userApiSlice";
import Loader from "../components/Loader";
import dinoNames from "../assets/dinoNames";
import { Typeahead } from "react-bootstrap-typeahead"
import { Link } from "react-router-dom";


function RequestScreen() {
    // Define constants for later
    const [listItems, setListItems] = useState([]);
    const [fetchPending] = useFetchPendingMutation() 
    const { userInfo } = useSelector((state) => state.auth)
    const [multiSelections, setMultiSelections] = useState([]);
    const [selectedRequest, setselectedRequest] = useState([]);
    const [requestDino, { isLoading }] = useRequestMutation()
    const [updateRequest, { isUpdating }] = useUpdateRequestMutation()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    

    // update function to keep the page dynamic
    useEffect(() => {
        async function fetchData() {
            const result = await fetchPending({ userInfo })
            setListItems(result.data);
        }
        // update list
        try{
            fetchData()
        }catch (err){
            console.warn("Trouble fetching pending dino request history:")
            console.warn(err)
        }        
    }, [fetchPending,userInfo]);

  // response to new request button
    const requestHandler = async (e) => {
        e.preventDefault()
        // if user isn't logged in
        
        if (!userInfo.id) {
            toast.error("Please log in")
        }else{
            // if we have something selected to add
            if (multiSelections !== ""){
                toast.info(`Requesting... ${multiSelections}`)
                // console.log(typeof multiSelections)
                await requestDino({ multiSelections, userInfo })
            }            
        }  
        const result = await fetchPending({ userInfo })
        setListItems(result.data);             
    }

    // Click options 
    const optionsHandler = async (event, clickedRequest) => {
        event.preventDefault()

        // toast.info(`${clickedItem.dino} was clicked`)
        setselectedRequest(clickedRequest)
        handleShow()
    }
    
    // delete handler
    const handleDelete = async () => {
      // Handle the delete operation here
      toast.success(`${selectedRequest.dino} request deleted`);
      handleClose();
      const updatedValue = {
        status: "DeletedByUser"
      }
      await updateRequest({ selectedRequest, updatedValue })
      const result = await fetchPending({ userInfo })
      setListItems(result.data);      
    };


  return (
    <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {`${selectedRequest.dino} requested on ${selectedRequest.updatedAt}, delete?`}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
    
        <FormContainer>  
            <h1>Request Dinos</h1>
            <h5>{userInfo.guilds[userInfo.guild].name}</h5>
            <Form >
                <Form.Group className='my-2' controlId="previously-requested">
                    <ListGroup>
                        <Form.Label>Pending Requests</Form.Label>
                        {Array.isArray(listItems) && listItems.map((item, index) => (
                            <ListGroup.Item key={index} action onClick={(event) => optionsHandler(event,item)} >
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">
                                    <img width="55" src={`https://www.dododex.com/media/creature/${item.dino.toLowerCase()}.png`} />
                                    {item.dino}
                                    <Badge bg="primary" pill>
                                    1
                                    </Badge>                                
                                </div>
                                {`Date: ${item.updatedAt.substring(0,10)} (${item.status})`}
                                <br/>
                                {`Tribe: ${item.guild.name} `}
                                </div>
                            
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Select Desired Dinos</Form.Label>
                    <Typeahead
                        id="Dino-Selector"
                        labelKey="dinoSearch"
                        multiple
                        onChange={setMultiSelections}
                        highlightOnlyResult={false}
                        options={dinoNames}
                        placeholder="Select multiple"
                        selected={multiSelections}
                    />
                </Form.Group>               

                {isLoading && <Loader />}             
                {isUpdating && <Loader />}             
                <Button onClick={requestHandler} variant="primary" className="mt-3">
                    Request 
                </Button>     
                <Link to="/home">
                    <Button variant="secondary" style={{float: 'right'}} className="mt-3">
                        Home
                    </Button>  
                </Link>   
            </Form>
        </FormContainer>   
    </> 
  )
}

export default RequestScreen
