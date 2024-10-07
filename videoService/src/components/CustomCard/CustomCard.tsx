import { Card, UserLabel, Text, Flex, Button } from "@gravity-ui/uikit"
import styles from "./CustomCard.module.css";
import { DEFAULT_LINK_PREVIEW, VideoItem } from "../ListVideos/ListVideos";
import { GraduationCap } from '@gravity-ui/icons'; 
export interface CustomCardProps extends VideoItem {
    actionCreate: (videoId: string, videoLink: string) => void; 
}

export const CustomCard = ({ Preview, AvatarSrc, UserName, description, Name, Id, actionCreate, Link }: CustomCardProps) => {
    return (
        <Card view={'outlined'} type="container" theme="normal" className={styles.card}>
            <img alt="Preview Video" src={Preview ? Preview : DEFAULT_LINK_PREVIEW} className={styles.image}></img>
            <div>
                <Flex direction={"column"} gap={2} style={{ marginBottom: "30px" }}>
                    <Text className={styles.header}>{Name}</Text>
                    <Text>{description}</Text>
                </Flex>
                {UserName && <div className={styles.userLabel}>
                    <UserLabel
                        type="person"
                        avatar={AvatarSrc ? AvatarSrc : { icon: GraduationCap }}

                    >
                        {UserName}
                    </UserLabel>
                </div>}
                <Button type="button" onClick={() => {if (Id && Link) actionCreate(Id, Link)}}>
                    Create room
                </Button>


            </div>

        </Card>
    )
}