import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Task State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(null); // Tracks which project we are adding a task to

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchProjects();
    }
  }, [navigate, token]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://team-task-manager-production-5872.up.railway.app', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://team-task-manager-production-5872.up.railway.app', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
        alert(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const handleCreateTask = async (e, projectId) => {
    e.preventDefault();
    try {
      await axios.post('https://team-task-manager-production-5872.up.railway.app',
        { title: taskTitle, description: taskDesc, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskTitle('');
      setTaskDesc('');
      setActiveProjectId(null); // Hide the form
      fetchProjects(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`https://team-task-manager-production-5872.up.railway.app`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProjects(); // Refresh to show the new status
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Team Workspace</h2>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {role === 'ADMIN' && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '8px', flex: 2 }} />
            <button type="submit" style={{ padding: '9px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create</button>
          </form>
        </div>
      )}

      <h3>Projects & Tasks</h3>
      {projects.length === 0 ? <p>No projects yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {projects.map((project) => (
            <div key={project.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px', background: '#fff' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{project.name}</h4>
              <p style={{ margin: '0 0 15px 0', color: '#555' }}>{project.description}</p>

              {/* TASK LIST */}
              <div style={{ marginLeft: '20px', borderLeft: '3px solid #007bff', paddingLeft: '15px' }}>
                <h5 style={{ margin: '0 0 10px 0' }}>Tasks:</h5>
                {project.tasks?.length === 0 ? <p style={{ fontSize: '14px', color: '#888' }}>No tasks assigned.</p> : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {project.tasks.map(task => (
                      <li key={task.id} style={{ background: '#f4f4f4', padding: '10px', marginBottom: '5px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{task.title}</strong>
                          <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>{task.description}</span>
                        </div>
                        
                        {/* Status Dropdown (Everyone can use this) */}
                        <select 
                          value={task.status} 
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </li>
                    ))}
                  </ul>
                )}

                {/* ADD TASK BUTTON & FORM (Admin Only) */}
                {role === 'ADMIN' && (
                  <div style={{ marginTop: '10px' }}>
                    {activeProjectId === project.id ? (
                      <form onSubmit={(e) => handleCreateTask(e, project.id)} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required style={{ padding: '5px', flex: 1 }} />
                        <input type="text" placeholder="Task Desc" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ padding: '5px', flex: 2 }} />
                        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setActiveProjectId(null)} style={{ background: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>
                      </form>
                    ) : (
                      <button onClick={() => setActiveProjectId(project.id)} style={{ background: '#e9ecef', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                        + Add Task
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;