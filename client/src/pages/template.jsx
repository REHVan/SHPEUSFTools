import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import UserNavBar from '../components/UserNavBar';
import { useNavigate } from 'react-router-dom';

function Template() {
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [templates, setTemplates] = useState([]); // State to hold email templates
  const [editingTemplateId, setEditingTemplateId] = useState(null); // State to track the template being edited
  const navigate = useNavigate();

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
              navigate("/template");
          } else {
              navigate("/");
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }     
  };

  checkUserRole();
    // Fetch existing templates from the server
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/get_email_templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching email templates:', error);
      }
    };
    fetchTemplates();
  }, []);

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/add_email_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateName, subject, body }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTemplate = await response.json(); // Get the new template from the response
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]); // Add to state
      // Clear the form
      setTemplateName('');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Error adding email template:', error);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.template_name);
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/update_template/${editingTemplateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateName, subject, body }),
      });

      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template.id === editingTemplateId ? updatedTemplate : template
          )
        );
        setEditingTemplateId(null); // Clear editing state
        setTemplateName('');
        setSubject('');
        setBody('');
      } else {
        console.error('Failed to update template:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDelete = async (templateId) => {
    try {
      const response = await fetch(`/delete_template/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.id !== templateId)
        );
      } else {
        console.error('Failed to delete template:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <>
      <UserNavBar />

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Add Email Template</h2>
        <form onSubmit={editingTemplateId ? handleUpdateTemplate : handleAddTemplate} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="templateName">Template Name</label>
            <input
              id="templateName"
              name="templateName"
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows="6"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
            {editingTemplateId ? 'Update Template' : 'Save Template'}
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-4 mt-6">Existing Email Templates</h2>
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Template Name</th>
              <th className="py-2 px-4 border">Subject</th>
              <th className="py-2 px-4 border">Body</th>
              <th className="py-2 px-4 border">Edit</th>
              <th className="py-2 px-4 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="py-2 px-4 border">{template.template_name}</td>
                <td className="py-2 px-4 border">{template.subject}</td>
                <td className="py-2 px-4 border">{template.body}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                    onClick={() => handleEdit(template)}
                  >
                    Edit
                  </button>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Template;
