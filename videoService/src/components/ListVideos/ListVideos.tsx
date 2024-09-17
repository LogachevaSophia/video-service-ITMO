import styles from './ListVideos.module.css'
import { CustomCard } from '../CustomCard/CustomCard';

export interface VideoItem {
    id: string,
    title: string,
    description: string,
    author?: string,
    avatarSrc?: string,
    preview?: string
}

export const DEFAULT_LINK_PREVIEW = "https://i.pinimg.com/originals/b1/f5/c9/b1f5c97c7841c776462f5de045e4bfde.png"

export const ListVideos = () => {
    const data: VideoItem[] = [
        {
            id: "dfjdn;kvj",
            title: "Финансирование",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
            avatarSrc: "https://loremflickr.com/640/480/cats?lock=8610182282084352",
            preview: "https://i.pinimg.com/736x/48/02/6b/48026b5e2493e6bd175f1f27615b9bc3.jpg"
        },
        {
            id: "dfjdn;kvjdfvd",
            title: "Финансирование2",
            description: "Описание блока финанисорвание eltj gnljglwetg;q kjn;",
            author: "такой-то чел",
            preview: "https://i.pinimg.com/736x/48/02/6b/48026b5e2493e6bd175f1f27615b9bc3.jpg"
        },
        {
            id: "dfjdn;kvjdfvdwef",
            title: "Финансирование3",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
            avatarSrc: "https://loremflickr.com/640/480/cats?lock=8610182282084352"
        },
        {
            id: "dfjddfvjdfvd",
            title: "Финансирование4",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
        }
    ]

    return (
        <section className={styles.listVideos}>
            {data.map(el => {
                return (
                    <CustomCard {...el}/>
                )
            })}
        </section >
    )
}