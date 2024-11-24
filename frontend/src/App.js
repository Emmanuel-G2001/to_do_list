import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskValue, setEditTaskValue] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    const addTask = () => {
        if (newTask.trim() === '') return;
        axios.post('http://127.0.0.1:5000/tasks', { task: newTask })
            .then(() => {
                setNewTask('');
                axios.get('http://127.0.0.1:5000/tasks').then(res => setTasks(res.data));
            })
            .catch(error => console.error(error));
    };

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:5000/tasks/${id}`)
            .then(() => axios.get('http://127.0.0.1:5000/tasks').then(res => setTasks(res.data)))
            .catch(error => console.error(error));
    };

    const enableEditMode = (task) => {
        setEditTaskId(task.id);
        setEditTaskValue(task.task);
    };

    const updateTask = () => {
        if (editTaskValue.trim() === '') return;
        axios.put(`http://127.0.0.1:5000/tasks/${editTaskId}`, { task: editTaskValue })
            .then(() => {
                setEditTaskId(null);
                setEditTaskValue('');
                axios.get('http://127.0.0.1:5000/tasks').then(res => setTasks(res.data));
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">To-Do List</h1>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New Task"
                />
                <button className="btn btn-primary" onClick={addTask}>Add</button>
            </div>
            <ul className="list-group">
                {tasks.map(task => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editTaskId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editTaskValue}
                                    onChange={(e) => setEditTaskValue(e.target.value)}
                                />
                                <button className="btn btn-success btn-sm ms-2" onClick={updateTask}>Save</button>
                                <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditTaskId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {task.task}
                                <div>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => enableEditMode(task)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
