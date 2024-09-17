import { Card, UserLabel, Text, Flex } from "@gravity-ui/uikit"
import styles from "./CustomCard.module.css";
import { DEFAULT_LINK_PREVIEW, VideoItem } from "../ListVideos/ListVideos";
import { GraduationCap } from '@gravity-ui/icons';

export const CustomCard = ({ preview, avatarSrc, author, description, title, id }: VideoItem) => {
    return (
        <Card view={'outlined'} type="container" theme="normal" className={styles.card} key={id}>
            <img alt="Preview Video" src={preview ? preview : DEFAULT_LINK_PREVIEW} className={styles.image}></img>
            <div>
                <Flex direction={"column"} gap={2} style={{ marginBottom: "30px" }}>
                    <Text className={styles.header}>{title}</Text>
                    <Text>{description}</Text>
                </Flex>
                {author && <div className={styles.userLabel}>
                    <UserLabel
                        type="person"
                        avatar={avatarSrc ? avatarSrc : { icon: GraduationCap }}

                    >
                        {author}
                    </UserLabel>
                </div>}


            </div>

        </Card>
    )
}