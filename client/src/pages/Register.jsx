import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Row, Col, Stack, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import defaultProfilePicURL from "../assets/default.jpg";


const Step1 = ({ onNext, updateRegisterInfo, registerInfo, showErrorModal }) => {
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleNext = () => {
    if (!registerInfo.email || !registerInfo.password || !registerInfo.confirmPassword || !registerInfo.firstName || !registerInfo.lastName) {
      showErrorModal("Please fill in all required fields.");
    } else if (registerInfo.password !== registerInfo.confirmPassword) {
      setPasswordMatch(false);
      showErrorModal("Password and Confirm Password do not match.");
    } else {
      setPasswordMatch(true);
      onNext();
    }
  };

  return (
    <div>
      <h3 className="text">Profile Details</h3>
      <Stack gap={3}>
        <Form.Control
          type="email"
          placeholder="Email"
          value={registerInfo.email || ""}
          onChange={(e) =>
            updateRegisterInfo({
              ...registerInfo,
              email: e.target.value,
            })
          }
        />
        <Form.Control
          type="password"
          placeholder="Password"
          value={registerInfo.password || ""}
          onChange={(e) =>
            updateRegisterInfo({
              ...registerInfo,
              password: e.target.value,
            })
          }
        />
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={registerInfo.confirmPassword || ""}
          onChange={(e) =>
            updateRegisterInfo({
              ...registerInfo,
              confirmPassword: e.target.value,
            })
          }
        />
        {!passwordMatch && (
          <div className="text-danger">Password and Confirm Password do not match.</div>
        )}
        <Form.Control
          type="text"
          placeholder="Reference Code (Optional)"
          value={registerInfo.referenceCode || ""}
          onChange={(e) =>
            updateRegisterInfo({
              ...registerInfo,
              referenceCode: e.target.value,
            })
          }
        />
        <Row>
          <Col xs="6">
            <Form.Control
              type="text"
              placeholder="First Name"
              value={registerInfo.firstName || ""}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  firstName: e.target.value,
                })
              }
            />
          </Col>
          <Col xs="6">
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={registerInfo.lastName || ""}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  lastName: e.target.value,
                })
              }
            />
          </Col>
        </Row>
      </Stack>

      <div className="text-center mt-3">
        <Button
          type="button" // Use type="button" to prevent form submission
          variant="light"
          className="text-dark border border-dark"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};



const Step2 = ({ onNext, onPrevious, updateRegisterInfo, registerInfo, uploadedImages, registerUser, countryOptions, cityOptions, stateOptions, imagePreview, setCountryOptions, setCityOptions, setStateOptions, setImagePreview  }) => {
 
  console.log(registerInfo)
    // Fetch country data from the API
    useEffect(() => {
      // Fetch the list of countries
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", "MGZMRlZLbkZ0SmNiOGkxQzBlREFLYjBKdlZZU1BnRmlRbGI3N2lvVg==");
  
      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };
  
      fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            value: country.iso2,
            label: country.name,
          }));
  
          // Sort the countries alphabetically by label
          countries.sort((a, b) => a.label.localeCompare(b.label));
  
          setCountryOptions(countries);
        })
        .catch(error => {
          console.error('Error fetching country data:', error);
        });
    }, []);

    
  
    const handleImageUpload = (e) => {
      if (e.target && e.target.files) {
        const files = e.target.files;
        const uploadedImages = [];
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
         
          if (file.size <= MAX_FILE_SIZE && isSupportedFileType(file.type)) {
           
            uploadedImages.push(file);
          } else {
          
          }
        }
    
        const updatedInfo = { ...registerInfo };
        updatedInfo.image = uploadedImages.length > 0 ? uploadedImages[0] : "";
        updatedInfo.images = uploadedImages;
    
        updateRegisterInfo(updatedInfo);
    
        if (uploadedImages.length > 0) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(uploadedImages[0]);
        } else {
         
          setImagePreview(defaultProfilePicURL);
        }
      }
    };
    
   
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    
  
    function isSupportedFileType(fileType) {
      const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return supportedTypes.includes(fileType);
    }
    
  
    // Fetch state data based on the selected country
    useEffect(() => {
      // Fetch the list of states for the selected country
      if (registerInfo.country) {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", "MGZMRlZLbkZ0SmNiOGkxQzBlREFLYjBKdlZZU1BnRmlRbGI3N2lvVg==");
  
        const requestOptions = {
          method: 'GET',
          headers: headers,
          redirect: 'follow',
        };
  
        fetch(`https://api.countrystatecity.in/v1/countries/${registerInfo.country}/states`, requestOptions)
          .then(response => response.json())
          .then(data => {
            const states = data.map(state => ({
              value: state.iso2,
              label: state.name,
            }));
  
            // Sort the states alphabetically by label
            states.sort((a, b) => a.label.localeCompare(b.label));
  
            setStateOptions(states);
          })
          .catch(error => {
            console.error('Error fetching state data:', error);
          });
      }
    }, [registerInfo.country]);
  
    // Fetch city data based on the selected state
    useEffect(() => {
      // Fetch the list of cities for the selected state
      if (registerInfo.state) {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", "MGZMRlZLbkZ0SmNiOGkxQzBlREFLYjBKdlZZU1BnRmlRbGI3N2lvVg==");
  
        const requestOptions = {
          method: 'GET',
          headers: headers,
          redirect: 'follow',
        };
  
        fetch(`https://api.countrystatecity.in/v1/countries/${registerInfo.country}/states/${registerInfo.state}/cities`, requestOptions)
          .then(response => response.json())
          .then(data => {
            const cities = data.map(city => ({
              value: city.id,
              label: city.name,
            }));
  
            // Sort the cities alphabetically by label
            cities.sort((a, b) => a.label.localeCompare(b.label));
  
            setCityOptions(cities);
          })
          .catch(error => {
            console.error('Error fetching city data:', error);
          });
      }
    }, [registerInfo.state, registerInfo.country]);

    const handlePrevious = () => {
      handleImageUpload(uploadedImages);
      onPrevious();
    };
  
  
    const handleNext = () => {
      onNext();
    };

   
    
    return (
      <div>
        <h3 className="text">Profile Details</h3>
      
        <Row>
          <Col xs="6">
          <div className="form-group">
            <DatePicker
              selected={registerInfo.dateOfBirth || ""}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  dateOfBirth: e,
                })
              }
              dateFormat="MM/dd/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              maxDate={new Date()}
              isClearable
              className="form-control" 
              placeholderText="Date of Birth"
            />
          </div>
          </Col>
          <Col xs="6">
            <Form.Control
              as="select"
              value={registerInfo.gender || ""}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </Form.Control>
          </Col>
        </Row>
  
        <div>
      <Row>
        <Col xs="12">
          <Select
            className="mt-3"
            value={countryOptions.find(option => option.value === registerInfo.country)}
            onChange={selectedOption =>
              updateRegisterInfo({
                ...registerInfo,
                country: selectedOption ? selectedOption.value : null,
                state: null,
                city: null,
              })
            }
            options={countryOptions}
            placeholder="Select Country"
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Select
            className="mt-3"
            value={stateOptions.find(option => option.value === registerInfo.state)}
            onChange={selectedOption =>
              updateRegisterInfo({
                ...registerInfo,
                state: selectedOption ? selectedOption.value : null,
                city: null,
              })
            }
            options={stateOptions}
            placeholder="Select State"
            isDisabled={!registerInfo.country}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Select
            className="mt-3"
            value={cityOptions.find(option => option.value === registerInfo.city)}
            onChange={selectedOption =>
              updateRegisterInfo({
                ...registerInfo,
                city: selectedOption ? selectedOption.value : null,
              })
            }
            options={cityOptions}
            placeholder="Select City"
            isDisabled={!registerInfo.state}
          />
        </Col>
      </Row>
    </div>

        {imagePreview && (
          <div className="text-center mt-3">
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{
                width: "180px", 
                height: "180px",
                borderRadius: "50%", 
              }}
            />
          </div>
        )}
        <Row>
          <Col xs="6">
            <Form.Group>
              <Form.Control
                type="file"
                multiple 
                onChange={handleImageUpload}
              />
            </Form.Group>
          </Col>
        </Row>
  
        <div className="text-center mt-3">
        <Button
          variant="light"
          className="text-dark border border-dark me-2"
          onClick={handlePrevious}
        >
          Prev
        </Button>
        <Button
          variant="light"
          className="text-dark border border-dark"
          onClick={registerUser}
        >
          Submit
        </Button>
      </div>
      </div>
    );
  };
  

  const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError } =
      useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(1);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [imagePreview, setImagePreview] = useState(defaultProfilePicURL);
      
  
    const nextStep = () => {
      setCurrentStep(currentStep + 1);
    };
  
    const showErrorModal = (message) => {
      setErrorMessage(message);
      setErrorModalOpen(true);
    };
  
    const closeErrorModal = () => {
      setErrorModalOpen(false);
    };
  
    const previousStep = () => {
      setCurrentStep(currentStep - 1);
    };
  
    const handleImageUpload = (images) => {
      setUploadedImages(images);
    };
  
    return (
      <div className="custom">
        <Form onSubmit={registerUser}>
          <Row className="form">
            <Col xs="6">
              <Stack gap="3">
                <h2 className="text">Register as Member</h2>
                {currentStep === 1 ? (
                  <Step1
                    onNext={nextStep}
                    updateRegisterInfo={updateRegisterInfo}
                    registerInfo={registerInfo}
                    showErrorModal={showErrorModal}
                  />
                ) : (
                  <Step2
                    onNext={nextStep}
                    onPrevious={previousStep}
                    updateRegisterInfo={updateRegisterInfo}
                    registerInfo={registerInfo}
                    uploadedImages={uploadedImages} 
                    handleImageUpload={handleImageUpload} 
                    registerUser={registerUser}
                    countryOptions={countryOptions}
                    stateOptions={stateOptions}
                    cityOptions={cityOptions}
                    imagePreview={imagePreview}
                    setCountryOptions={setCountryOptions}
                    setStateOptions={setStateOptions}
                    setImagePreview={setImagePreview}
                    setCityOptions={setCityOptions}
                  />
                )}
              </Stack>
            </Col>
          </Row>
        </Form>
        <Modal show={errorModalOpen} onHide={closeErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please provide the following:</p>
            <p>{errorMessage}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeErrorModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  
  export default Register;