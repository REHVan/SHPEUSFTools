import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import HeaderDisplay from '../components/HeaderDisplay';
import SubHeaderDisplay from '../components/SubHeaderDisplay';
import FormInputDisplay from '../components/FormInputDisplay';
import FormInputDDLDisplay from '../components/FormInputDDLDisplay';
import Navbar from '../components/Navbar';

function Profile() {
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

  const numberMenteeOptions = [    { label: '', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];

  const navigate = useNavigate();
  const [userMentorOrMentee, setUserMentorOrMentee] = useState("");
  const [formData, setFormData] = useState({});

  const handleMenteeOrMentor = (e) => {
    const selectedRole = e.target.value;
    setUserMentorOrMentee(selectedRole);

    var inputLists = document.querySelectorAll("input");
    var visibleInputIds = {};

    inputLists.forEach(function(input) {
        const style = window.getComputedStyle(input);
        if (style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity > 0 &&
            input.offsetWidth > 0 &&
            input.offsetHeight > 0) {
            visibleInputIds[input.id] = ""; 
        }
    });
    
    setFormData(visibleInputIds);     
};


 const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(formData);

    setFormData({
      ...formData,
      [name]: value
    });
  };




  useEffect(() => {
    const checkIfAlreadySubmited = async () => {
      try {
        const response = await fetch('/checkIfSubmitedBefore');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);

        if (data.submitted === true)
        {
          navigate("/userNav");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }     
    };
   
    

    checkIfAlreadySubmited();
  }, []);


  return (
    <div>
      <Navbar />
    <Form action="/formSubmit" method="post">
  <HeaderDisplay>MentorSHPE Spring '24 Registration</HeaderDisplay>
  
  <p>Prepare for an extraordinary adventure with MentorSHPE this year, where mysteries unfold and excitement awaits at every corner! Our program invites both mentors and mentees to join forces in a journey of knowledge, growth, and camaraderie. Seasoned mentors will share their valuable experiences, guiding mentees through higher-level classes, internships, and the diverse landscape of opportunities within our SHPE community. Together, we'll foster a spirit of Familia as we explore the lands of the bulls, discovering the magic that lies ahead in this thrilling and unique expedition.</p>
  <br />
  <p>Deadline for Mentor Applications: Sun, Jan 28th 11:59 pm</p>
  <p>Deadline for Mentee Applications: Wed, Jan 31st 6:00 pm</p>

  <FormInputDisplay label="Mentee" id="btnMentee" type="radio" name="userMentorOrMentee" value="mentee" onChange={handleMenteeOrMentor} checked={userMentorOrMentee === "mentee"} />
  <FormInputDisplay label="Mentor" id="btnMentor" type="radio" name="userMentorOrMentee" value="mentor" onChange={handleMenteeOrMentor} checked={userMentorOrMentee === "mentor"} />

  <div id="divMentee"  style={{ display: userMentorOrMentee === "mentee" ? 'block' : 'none' }}>
    <p>Mentees, your journey into uncharted territory begins now. Guided by experienced upperclassmen mentors, you'll tackle higher-level classes, explore internships, and face practical challenges that will test your abilities. Compete for recognition, earn points for your team, and showcase your involvement in this practical exploration. With bi-weekly mentor meetings, this semester promises real growth, genuine connections, and the thrill of practical discoveries. Enlist now and become an essential part of the unfolding story of your own practical success within this remarkable adventure.</p>
    
    <FormInputDisplay label="Full Name" id="menteeFullName" type="text" name="menteeFullName" onChange={handleFormChange}/>
    <br />
    <FormInputDisplay label="USF Email" id="menteeUsfEmail" type="text" name="menteeUsfEmail" />
    <br />
    <FormInputDisplay label="Phone Number" id="menteePhoneNumber" type="text" name="menteePhoneNumber" />
    <br />
    <FormInputDDLDisplay label="Major" id="menteeMajor" name="menteeMajor" options={majorOptions} />
    <br />
    <FormInputDDLDisplay label="Year" id="menteeYear" name="menteeYear" options={yearOptions} />
    <br />
    <label htmlFor="rbYesNoMenteePrior">Have you been a mentee for MentorSHPE in the past?</label>
    <FormInputDisplay label="Yes" id="rbYesMenteePrior" type="radio" name="rbYesNoMenteePrior" />
    <FormInputDisplay label="No" id="rbNoMenteePrior" type="radio" name="rbYesNoMenteePrior" />
    <br />
    <FormInputDisplay label="What do you want to gain out of MentorSHPE?" id="menteeGoals" type="text" name="menteeGoals" />
    <br />
    <FormInputDisplay label="If you could describe yourself as a song, which song would it be?" id="menteeSong" type="text" name="menteeSong" />
    <br />
    <FormInputDisplay label="What are your interests and hobbies?" id="menteeInterest" type="text" name="menteeInterest" />
    <br />
    <FormInputDisplay label="Tell us a fun fact about yourself!" id="menteeFunFact" type="text" name="menteeFunFact" />
    <br />
  </div>

  <div id="divMentor" style={{ display: userMentorOrMentee === "mentor" ? 'block' : 'none' }}>
    <p>Mentors, this is your chance to guide and inspire the next generation. As a mentor, you'll share your knowledge and experience, helping mentees navigate higher-level classes, internships, and practical challenges. Your involvement will not only benefit the mentees but also enrich your own understanding and leadership skills. Join us in this rewarding journey and make a lasting impact.</p>
    
    <FormInputDisplay label="Full Name" id="mentorFullName" type="text" name="mentorFullName" />
    <br />
    <FormInputDisplay label="USF Email" id="mentorUsfEmail" type="text" name="mentorUsfEmail" />
    <br />
    <FormInputDisplay label="Phone Number" id="mentorPhoneNumber" type="text" name="mentorPhoneNumber" />
    <br />
    <FormInputDDLDisplay label="Major" id="mentorMajor" name="mentorMajor" options={majorOptions} />
    <br />
    <FormInputDDLDisplay label="Year" id="mentorYear" name="mentorYear" options={yearOptions} />
    <br />
    <FormInputDDLDisplay label="Number of Mentees" id="mentorMenteeCount" name="mentorMenteeCount" options={numberMenteeOptions} />
    <br />
    <label htmlFor="rbYesNoMentorPrior">Have you been a mentor for SHPE or other organizations?</label>
    <FormInputDisplay label="Yes" id="rbYesMentorPrior" type="radio" name="rbYesNoMentorPrior" />
    <FormInputDisplay label="No" id="rbNoMentorPrior" type="radio" name="rbYesNoMentorPrior" />
    <br />
    <FormInputDisplay label="Goals" id="mentorGoals" type="text" name="mentorGoals" />
    <br />
    <FormInputDisplay label="Describe yourself as a song" id="mentorSong" type="text" name="mentorSong" />
    <br />
    <FormInputDisplay label="Interests and Hobbies" id="mentorInterest" type="text" name="mentorInterest" />
    <br />
    <FormInputDisplay label="Fun Fact" id="mentorFunFact" type="text" name="mentorFunFact" />
    <br />
  </div>
  
  <br />
  <button type="submit">Submit</button>
</Form>

    
  </div>
  
  
  )
}

export default Profile