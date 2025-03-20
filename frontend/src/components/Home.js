import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Добро пожаловать в систему учёта и продажи антиквариата</h1>
            <p>Здесь вы можете создавать, редактировать и просматривать записи о вашем антиквариате.</p>
            <Link to="/login">
                <button>Войти</button>
            </Link>
            <Link to="/register">
                <button>Зарегистрироваться</button>
            </Link>
        </div>
    );
};

export default Home;

