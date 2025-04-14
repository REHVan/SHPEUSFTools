import React, { useState, useEffect } from 'react';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import UserNavBar from '../components/UserNavBar';
import { useNavigate } from 'react-router-dom';

function External() {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subjectEmail, setSubjectEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [ggPassword, setGgPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState('');

  const itemsPerPage = 50;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/get_contacts')
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));

    fetch('/get_email_templates')
      .then(response => response.json())
      .then(data => setTemplates(data))
      .catch(error => console.error('Error fetching templates:', error));
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {   
      setMessage(template.emailbody);
      setSubjectEmail(template.emailsubject);
    }
  };

  const handleCheckboxChange = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const sendEmail = async (e) => {
    e.preventDefault();
  
    const endpoint = scheduleMode ? '/schedule_email_external' : '/send_email_external';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ggPassword,
          fromEmail,
          ccEmail,
          subjectEmail,
          messageEmail: message,
          selectedContacts,
          scheduledStartTime, 
        })
      });
  
      const responseBody = await response.json();
  
      if (response.ok) {
        setFeedbackMessage(scheduleMode 
          ? `Scheduled ${responseBody.totalScheduled} emails successfully.` 
          : `Sent ${responseBody.results.filter(r => r.status === 'sent').length} emails successfully at ${new Date().toLocaleTimeString()}`
        );
        setTimestamp(new Date().toLocaleTimeString());
        setSelectedContacts([]);
      } else {
        setFeedbackMessage(responseBody.message || "Failed to send emails.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFeedbackMessage('Error sending emails. Please try again.');
    }
  };
  
  
  const handleSelectAllChange = () => {
    const currentPageContactIds = currentContacts.map(contact => contact.id);
    const allSelected = currentPageContactIds.every(id => selectedContacts.includes(id));

    if (allSelected) {
      setSelectedContacts(prev => prev.filter(id => !currentPageContactIds.includes(id)));
    } else {
      setSelectedContacts(prev => [...new Set([...prev, ...currentPageContactIds])]);
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="form-container">
      <div className="flex items-center space-x-4 my-4">
  <span className="text-sm font-medium">Send Mode</span>
  <button
    onClick={() => setScheduleMode(prev => !prev)}
    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out ${
      scheduleMode ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        scheduleMode ? 'translate-x-7' : ''
      }`}
    />
  </button>
  <span className="text-sm">
    {scheduleMode ? 'Scheduled' : 'Immediate'}
  </span>
</div>

{scheduleMode && (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">
      Schedule Start Time
    </label>
    <input
      type="datetime-local"
      className="border border-gray-300 rounded px-3 py-2 w-full"
      value={scheduledStartTime}
      onChange={e => setScheduledStartTime(e.target.value)}
    />
  </div>
)}

        <form onSubmit={sendEmail}>
        <FormInputDisplay
            label="Google Password:"
            id="ggPassword"
            type="text"
            name="ggPassword"
            value={ggPassword}
            onChange={e => setGgPassword(e.target.value)}
          />
          <FormInputDisplay
            label="CC:"
            id="ccEmail"
            type="text"
            name="ccEmail"
            value={ccEmail}
            onChange={e => setCcEmail(e.target.value)}
          />
          <FormInputDisplay
            label="Subject:"
            id="subjectEmail"
            type="text"
            name="subjectEmail"
            required
            value={subjectEmail}
            onChange={e => setSubjectEmail(e.target.value)}
          />
             <div>
          <label htmlFor="emailTemplate">Template:</label>
          <select id="emailTemplate" onChange={handleTemplateChange}>
            <option value="">Select a template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
        <FormInputDisplay
          label="Message:"
          id="messageEmail"
          type="textarea"
          name="messageEmail"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
          <button className="mt-4 w-[70%] rounded-lg mx-auto block" type="submit">Send Emails</button>

          {feedbackMessage && (
  <div className="mt-4 text-center text-green-600 font-medium">
    {feedbackMessage}
  </div>
)}

        </form>
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border">
                <input
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={currentContacts.every(contact => selectedContacts.includes(contact.id)) && currentContacts.length > 0}
                />
              </th>
              <th className="py-2 px-4 border">Contact Name</th>
              <th className="py-2 px-4 border">Email Address</th>
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map(contact => (
              <tr key={contact.id}>
                <td className="py-2 px-4 border">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(contact.id)}
                    checked={selectedContacts.includes(contact.id)}
                  />
                </td>
                <td className="py-2 px-4 border">{contact.name}</td>
                <td className="py-2 px-4 border">{contact.email}</td>
                <td className="py-2 px-4 border">{contact.company}</td>
                <td className="py-2 px-4 border">{contact.position}</td>
                <td className="py-2 px-4 border">{contact.notes}</td>
          
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default External;
