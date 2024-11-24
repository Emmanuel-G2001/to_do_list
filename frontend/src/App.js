import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    const addTask = () => {
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

    return (
        <div>
            <h1>To-Do List</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New Task"
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.task} <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
