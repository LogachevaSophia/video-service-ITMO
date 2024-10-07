import styles from './ListVideos.module.css'
import { CustomCard } from '../CustomCard/CustomCard';
import React from 'react';

export interface VideoItem {
    Id?: string,
    Name: string,
    description: string,
    UserName?: string,
    AvatarSrc?: string,
    Preview?: string,
    cost?: number | string,
    Link?: string
}


export interface propsListVideos {
    data: VideoItem[],
    actionCreate: (videoId: string, videoLink: string) => void; 
}

export const DEFAULT_LINK_PREVIEW = "https://i.pinimg.com/originals/b1/f5/c9/b1f5c97c7841c776462f5de045e4bfde.png"

export const ListVideos: React.FC<propsListVideos> = ({ data, actionCreate }) => {


    return (
        <section className={styles.listVideos}>
            {data.map(el => {
                return (
                    // <Link to={`video/${el.Id}`} key={el.Id}>
                        <CustomCard {...el}   key={el.Id} actionCreate={actionCreate}/>
                    // </Link>

                )
            })}
        </section >
    )
}