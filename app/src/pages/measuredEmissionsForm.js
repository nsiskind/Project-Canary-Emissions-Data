import React, { useState } from 'react';
import {UpsertMeasuredEmission} from '../services/service'
import './pages.css'

const MeasuredEmissionsForm = ({setDataDidUpdate}) => {
  const [formData, setFormData] = useState({
    site: '',
    latitude: '',
    longitude: '',
    equipmentGroupName: '',
    equipmentId: '',
    start: '',
    end: '',
    methaneInKg: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every((field) => field.trim() !== '');
  };

  const isTimeValid = (input) => {
      // 1/1/2023 0:00
      const regex = new RegExp('^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4} [0-9]{1,2}:[0-9]{2}$');
      return regex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('All fields are required');
      return;
    }

    if (!isTimeValid(formData['end'])) {
      setError('End must be of the format MM/DD/YYYY HH:MM');
      setFormData({
        ...formData,
        end: '',
      });
      return
    }

    if (!isTimeValid(formData['start'])) {
      setError('Start must be of the format MM/DD/YYYY HH:MM');
      setFormData({
        ...formData,
        start: '',
      });
      return
    }

    try {   
      const response = await UpsertMeasuredEmission(formData)
        setFormData({
          site: '',
          latitude: '',
          longitude: '',
          equipmentGroupName: '',
          equipmentId: '',
          start: '',
          end: '',
          methaneInKg: ''
        });
        const data = await response.json()
        if (data["error"]) {
          console.error('Error:', data["error"]);
          setSuccess(false);
        } else {
          setError('');
          setSuccess(true);
          setDataDidUpdate(true)
        }
    } catch (error) {
      console.error('Error:', error);
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>Add a Measured Emission</h2>
      <form className="emissionsForm" onSubmit={handleSubmit}>
        <div className='emissionsInput'>
          <label>Site:</label>
          <input
            type="text"
            name="site"
            value={formData.site}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Latitude:</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Longitude:</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Equipment Group Name:</label>
          <input
            type="text"
            name="equipmentGroupName"
            value={formData.equipmentGroupName}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Equipment ID:</label>
          <input
            type="text"
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Start:</label>
          <input
            type="text"
            name="start"
            value={formData.start}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>End:</label>
          <input
            type="text"
            name="end"
            value={formData.end}
            onChange={handleChange}
          />
        </div>
        <div className='emissionsInput'>
          <label>Methane In Kg:</label>
          <input
            type="text"
            name="methaneInKg"
            value={formData.methaneInKg}
            onChange={handleChange}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{"Success!"}</p>}

        <button type="submit" disabled={!isFormValid()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default MeasuredEmissionsForm;
