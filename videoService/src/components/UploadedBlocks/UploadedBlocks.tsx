import { Button, Card, Modal, TextInput } from "@gravity-ui/uikit"
import { CustomCard } from "../CustomCard/CustomCard"
import { VideoItem } from "../ListVideos/ListVideos"
import styles from "./UploadedBlocks.module.css"
import { useState } from "react"
import { AddVideoForm } from "../AddVideoForm/AddVideoForm"

export const UpdatedBlocks = () => {

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
            id: "dfvffjddfvjdfvd",
            title: "Финансирование4",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
        },
        {
            id: "dfjddfvjsssdfvd",
            title: "Финансирование4",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
        },
        {
            id: "dfjddfvjdfvd",
            title: "Финансирование4",
            description: "Описание блока финанисорвание",
            author: "такой-то чел",
        }
    ]
    const [open, setOpen] = useState(false)
    const [videos, setVideos] = useState<
        { title: string; description: string; link: string, id: string }[]
    >([{ title: "dgjk", description: "fbb", link: "dkfv", id: "dfjfv" }, { title: "dgjk", description: "fbb", link: "dkfv", id: "dfjv" }, { title: "dgjk", description: "fbb", link: "dkfv", id: "dfdfbdbjv" }, { title: "dgjk", description: "fbb", link: "dkfv", id: "dfasljv" }]);

    const handleAddVideo = (video: any) => {
        console.log(video)

        setVideos(previos => [...previos, video])

    }
    return (
        <section>
            <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
                <form className={styles["modal-form"]}>
                    <TextInput placeholder="title" />
                    <TextInput placeholder="description" />
                    <section >
                        <section area-label="uploaded video" className={styles["uploaded-video"]}>
                            {videos.map((video, index) => (
                                <CustomCard {...video} key={video.id}/>
                            ))}
                        </section>

                        <AddVideoForm onAddVideo={handleAddVideo} />

                    </section>
                    <Button type="submit" view="action">Save</Button>
                </form>
            </Modal>
            <Card type="container" view={'outlined'} className={styles.container}>
                <div >
                    {data.map(el => {
                        return (
                            <CustomCard {...el} key={el.id}/>
                        )
                    })}
                </div>
                <Button type="button" view="action" className={styles.button} onClick={() => setOpen(true)}>Upload block</Button>

            </Card>


        </section>
    )
}