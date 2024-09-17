import React, { useState } from 'react';
import styles from './SideBar.module.css'
import classNames from 'classnames';
import { Person, House, ArrowRightFromSquare, ClockArrowRotateLeft, Gear, CloudArrowUpIn } from '@gravity-ui/icons';
import { Icon, IconData } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';


export const SideBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    //   const toggleSideBar = () => {
    //     setIsOpen(!isOpen);
    //   };
    const generateItem = (icon: IconData, text: string) => {
        return (<>
            <Icon data={icon}></Icon>
            <span>{text}</span>
        </>)
    }

    return (
        <div className={isOpen ? classNames(styles.sidebar, styles.open) : classNames(styles.sidebar, styles.closed)}>
            <div className={styles["sidebar-content"]}>
                <header>
                    {svg()}
                </header>
                <nav>
                    <ul>
                        <li> <Link to="/profile">{generateItem(Person, "Profile")}</Link></li>
                        <li>  <Link to="/">{generateItem(House, "Home")}</Link></li>
                        <li> <Link to="/history">{generateItem(ClockArrowRotateLeft, "History")}</Link></li>
                        <li> <Link to="/admin">{generateItem(CloudArrowUpIn, "Admin")}</Link></li>
                    </ul>

                    <ul className={styles.last}>

                        <li><Link to="/settings">{generateItem(Gear, "Settings")}</Link></li>
                        <li><Link to="/">{generateItem(ArrowRightFromSquare, "Log out")}</Link></li>

                    </ul>
                </nav>
            </div>
        </div>
    );
};



export const svg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
            <path fill="#91c14b" fillRule="evenodd" d="M19.003,31.003v-2h4v-2	h4v-2h2v-6h-2v-2h-4l-4-3h-6l-4,3h-4v2h-2v6h2v2h4v2h4v2H19.003z" clipRule="evenodd"></path><path fill="#e6e5e5" fillRule="evenodd" d="M9.003,17.003l1-1h2l2,2	l-3,3h-2V17.003z" clipRule="evenodd"></path><path fill="#064678" fillRule="evenodd" d="M11.001,19.004v1.999	h2.001v-1.999H11.001z" clipRule="evenodd"></path><path fill="#e6e5e5" fillRule="evenodd" d="M23.003,17.003l-1-1h-2	l-2,2l3,3h2V17.003z" clipRule="evenodd"></path><path fill="#064678" fillRule="evenodd" d="M19.001,19.004v1.999	h2.001v-1.999H19.001z" clipRule="evenodd"></path><path fill="#e41e2f" fillRule="evenodd" d="M11.003,10.003v-3h2v-4	h2v-2h8v2h2v2h2v2h-4v-2h-4v2h2v3H11.003z" clipRule="evenodd"></path><path fill="#e6e5e5" fillRule="evenodd" d="M9.003,15.003h-2v-6h18	v6h-2l-2,1l-2-1h-6l-2,1L9.003,15.003z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M15.001,27.004v1.999	h2.001v-1.999H15.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M9.001,25.004v1.999	h6.001v-1.999H9.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M17.001,25.004v1.999	h6.001v-1.999H17.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M7.001,23.004v1.999	h2.001v-1.999H7.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M5.001,21.004v1.999	h2.001v-1.999H5.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M23.001,23.004v1.999	h2.001v-1.999H23.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M25.001,21.004v1.999	h2.001v-1.999H25.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M15.001,21.004v1.999	h2.001v-1.999H15.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M13.001,17.004v1.999	h2.001v-1.999H13.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M17.001,17.004v1.999	h2.001v-1.999H17.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M9.001,15.004v1.999	h4.001v-1.999H9.001z" clipRule="evenodd"></path><path fill="#00953f" fillRule="evenodd" d="M19.001,15.004v1.999	h4.001v-1.999H19.001z" clipRule="evenodd"></path><path fill="#e41e2f" fillRule="evenodd" d="M27.003,9.003v-2h2v3	L27.003,9.003z" clipRule="evenodd"></path><path fill="#e6e5e5" fillRule="evenodd" d="M27.001,9.004v3.999	h4.001V9.004H27.001z" clipRule="evenodd"></path>
        </svg>
    )
}
