import { Button, Card, Icon, Modal, TextInput } from "@gravity-ui/uikit"
import { CustomCard } from "../CustomCard/CustomCard"
import { VideoItem } from "../ListVideos/ListVideos"
import styles from "./UploadedBlocks.module.css"
import { useEffect, useState } from "react"
import { AddVideoForm } from "../AddVideoForm/AddVideoForm"
import {CirclePlus} from '@gravity-ui/icons';
import { useForm } from "react-hook-form"
import { UploadBlockController } from "../../API/Controllers/AdminController"

export interface UploadBlock {
    title: string,
    description: string,
    videos: VideoItem[]
}

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
    const [open, setOpen] = useState<boolean>(false)
    const [openUploadVideo, setOpenUploadVideo] = useState<boolean>(false)
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const {handleSubmit, register, setValue} = useForm<UploadBlock>();

    const handleAddVideo = (video: VideoItem) => {
        console.log(video)
        setVideos(previos => [...previos, video])
        setOpenUploadVideo(false);
    }

    useEffect(()=> {
        setValue('videos', videos)
    }, [videos])
    const onSubmit = async (data: UploadBlock) => {
        console.log(data)
        const res = await UploadBlockController(data)
        console.log(res)
    }
    return (
        <section>
            <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
                <form className={styles["modal-form"]} onSubmit={handleSubmit(onSubmit)}>
                    <TextInput placeholder="title" {...register('title')}/>
                    <TextInput placeholder="description" {...register('description')}/>
                    <section >
                        <section area-label="uploaded video" className={styles["uploaded-video"]}>
                            {videos.map((video, index) => (
                                <CustomCard {...video} key={index}/>
                            ))}
                        </section>
                        <Button onClick={()=>setOpenUploadVideo(true)}>Upload Video<Icon data={CirclePlus}/></Button>

                        {openUploadVideo && <AddVideoForm onAddVideo={handleAddVideo} />}

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