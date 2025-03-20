import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ authToken, onLogout }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const res = await axios.get('http://localhost:5001/api/items', {
                headers: { Authorization: authToken },
            });
            setItems(res.data.items);
        };
        fetchItems();
    }, [authToken]);

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={onLogout}>Logout</button>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
