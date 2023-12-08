import React, { useState } from 'react';

const FileUpload = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [apiImageSrc, setApiImageSrc] = useState(null);

  const readURL = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImageSrc(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  const removeUpload = () => {
    setImageSrc(null);
    // Additional logic for removing the uploaded image
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    // Add logic for handling each option
  };

  const handleUpload = () => {
  if (imageSrc && selectedOption) {
    // Convert the image to base64
    const base64Image = imageSrc.split(',')[1];

    // Prepare the data to send in the request
    const requestData = {
      body: base64Image,
      choice: selectedOption,
    };

    // Make a POST request to your API
    fetch('https://0f1qy8uvzl.execute-api.eu-north-1.amazonaws.com/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(result => {
        // Handle the API response
        console.log('API Response:', result);

        // Extract the base64 encoded image string from the response
        const apiImageSrc = result.body;

        // Set the state to update the displayed image
        setApiImageSrc(apiImageSrc);
      })
      .catch(error => {
        console.error('Error:', error);
        // Add your logic to handle errors
      });
  } else {
    console.error('Image or choice not selected');
    // Add your logic to handle this case
  }
};

  

  return (
    <div className="file-upload">
      <button
        className="file-upload-btn"
        type="button"
        onClick={() => document.querySelector('.file-upload-input').click()}
      >
        Add Image
      </button>

      <div className="image-upload-wrap">
        <input
          className="file-upload-input"
          type="file"
          onChange={(e) => readURL(e.target)}
          accept="image/*"
        />
        <div className="drag-text">
          <h3>Drag and drop a file or select add Image</h3>
        </div>
      </div>

      <div className="file-upload-content">
        {imageSrc && (
          <img className="file-upload-image" src={imageSrc} alt="your image" />
        )}
        <div className="image-title-wrap">
          <button type="button" onClick={removeUpload} className="remove-image">
            Remove <span className="image-title">Uploaded Image</span>
          </button>
        </div>
      </div>

      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            name="options"
            value="convertToGray"
            checked={selectedOption === 'convertToGray'}
            onChange={() => handleOptionChange('convertToGray')}
          />
          Convert to Gray
        </label>
        <label>
          <input
            type="radio"
            name="options"
            value="compress"
            checked={selectedOption === 'compress'}
            onChange={() => handleOptionChange('compress')}
          />
          Compress
        </label>
        <label>
          <input
            type="radio"
            name="options"
            value="rotate"
            checked={selectedOption === 'rotate'}
            onChange={() => handleOptionChange('rotate')}
          />
          Rotate
        </label>
      </div>

      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>

      {apiImageSrc && (
      <div className="api-image">
        <h3>API Response Image</h3>
        <img src={`data:image/png;base64, ${apiImageSrc}`} alt="API response" />
      </div>
    )}
    </div>
  );
};

export default FileUpload;
