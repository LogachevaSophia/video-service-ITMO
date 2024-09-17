import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from '../SideBar/SideBar';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
    return (
        <div className={styles.layoutContainer}>
            <SideBar />
            <main className={styles.content}>
                <Outlet /> {/* Используется для рендеринга дочерних маршрутов */}
            </main>
        </div>
    );
};
