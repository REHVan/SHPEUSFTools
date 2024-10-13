import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import UserNavBar from '../components/UserNavBar';
import FormInputDDLDisplay from '../components/FormInputDDLDisplay';
import { useNavigate } from 'react-router-dom';

function AllProfile() {
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [majorFilter, setMajorFilter] = useState("");
  const [participateTypeFilter, setParticipateTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const navigate = useNavigate();

  const majorOptions = [
    { label: '', value: '' },
    { label: 'Chemical Engineering', value: 'Chemical Engineering' },
    { label: 'Biomedical Engineering', value: 'Biomedical Engineering' },
    { label: 'Civil Engineering', value: 'Civil Engineering' },
    { label: 'Computer Engineering', value: 'Computer Engineering' },
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Cybersecurity', value: 'Cybersecurity' },
    { label: 'Electrical Engineering', value: 'Electrical Engineering' },
    { label: 'Environmental Engineering', value: 'Environmental Engineering' },
    { label: 'Industrial Engineering', value: 'Industrial Engineering' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Biomedical Sciences/Health Related', value: 'Biomedical Sciences/Health Related' },
    { label: 'Other', value: 'Other' },
  ];

  const yearOptions = [
    { label: '', value: '' },
    { label: 'Freshman', value: 'Freshman' },
    { label: 'Sophomore', value: 'Sophomore' },
    { label: 'Junior', value: 'Junior' },
    { label: 'Senior', value: 'Senior' },
    { label: 'Graduate', value: 'Graduate' },
  ];

  const participateType = [
    { label: '', value: '' },
    { label: 'Mentee', value: 'mentee' },
    { label: 'Mentor', value: 'mentor' },
  ];

  useEffect(() => {
    const checkUserRole = async () => {
      try {
          const response = await fetch('/checkUserRole');
          if (!response.ok) {
              if (response.status === 401) {
                  navigate("/login"); // Redirect to login if not authenticated
                  return;
              }
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data);

          if (data.userRole === "Admin") {
              navigate("/allProfile");
          } else {
              navigate("/");
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }     
  };

  checkUserRole();
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/getUserdetails');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDetails(data); // Set all user details directly
        setFilteredUserDetails(data); // Initialize filtered data with all user details
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Function to filter user details based on filters
  const applyFilters = () => {
    const filteredData = userDetails.filter((userDetail) => {
      const majorInfo = userDetail.userInfo.find(info => info.detail === 'menteeMajor' || info.detail === 'mentorMajor');
      const participateTypeInfo = userDetail.userInfo.find(info => info.detail === 'userMentorOrMentee');
      const yearInfo = userDetail.userInfo.find(info => info.detail === 'menteeYear' || info.detail === 'mentorYear');

      const matchesMajor = majorInfo && majorInfo.value.toLowerCase().includes(majorFilter.toLowerCase());
      const matchesParticipateType = participateTypeInfo && participateTypeInfo.value.toLowerCase().includes(participateTypeFilter.toLowerCase());
      const matchesYear = yearInfo && yearInfo.value.toLowerCase().includes(yearFilter.toLowerCase());

      return (
        (!majorFilter || matchesMajor) &&
        (!participateTypeFilter || matchesParticipateType) &&
        (!yearFilter || matchesYear)
      );
    });

    setFilteredUserDetails(filteredData); // Update the filtered user details
  };

  const handleMajorChange = (filterValue) => {
    setMajorFilter(filterValue);
    applyFilters(); // Apply filters whenever major changes
  };

  const handleParticipateTypeChange = (filterValue) => {
    setParticipateTypeFilter(filterValue);
    applyFilters(); // Apply filters whenever participate type changes
  };

  const handleYearChange = (filterValue) => {
    setYearFilter(filterValue);
    applyFilters(); // Apply filters whenever year changes
  };

  const clearFilters = () => {
    setMajorFilter("");
    setParticipateTypeFilter("");
    setYearFilter("");
    setFilteredUserDetails(userDetails); // Reset to show all user details
  };

  return (
    <>
      <UserNavBar />
      
      <FormInputDDLDisplay 
        label="Major Filter:" 
        id="ddlMajorFilter" 
        name="ddlMajorFilter" 
        options={majorOptions} 
        value={majorFilter} 
        onChange={e => handleMajorChange(e.target.value)} 
      />
      <FormInputDDLDisplay 
        label="Participate Type Filter:" 
        id="ddlParticipateTypeFilter" 
        name="ddlParticipateTypeFilter" 
        options={participateType} 
        value={participateTypeFilter} 
        onChange={e => handleParticipateTypeChange(e.target.value)} 
      />
      <FormInputDDLDisplay 
        label="Year Filter:" 
        id="ddlYearFilter" 
        name="ddlYearFilter" 
        options={yearOptions} 
        value={yearFilter} 
        onChange={e => handleYearChange(e.target.value)} 
      />

      <button 
        onClick={clearFilters} 
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded"
      >
        Clear Filters
      </button>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Display all the user details</h1>

        <div className="flex flex-wrap gap-6">
          {filteredUserDetails.map((detail) => (
            <Card key={detail.userId} detailInfo={detail} />
          ))}
        </div>
      </div>
    </>
  );
}

export default AllProfile;
