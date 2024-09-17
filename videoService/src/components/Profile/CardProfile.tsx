import { Avatar, Card, Icon, Label, Text } from '@gravity-ui/uikit'
import styles from './Card.module.css'

import { TextInput } from '@gravity-ui/uikit';
import {Pencil} from '@gravity-ui/icons';

export const CardProfile = ({ srcImage }: { srcImage: string }) => {
    return (
        <section className={styles.card}>
            <Card type="container" theme="normal" className={styles.cardContent} view="filled">
                <section className={styles.avatar}>
                    <Avatar imgUrl={srcImage} size="xl" className={styles.image}></Avatar>
                    <div className={styles.editAvatar}>
                        <div>
                        <Icon data={Pencil} className={styles.pencil}></Icon>
                        </div>
                       
                    </div>
                </section>

                <Text className={styles.fio}>Harriet Nunez</Text>
                <TextInput disabled size="xl" leftContent={<Label className={styles.leftContent} size="m">Email</Label>} value='lsofa1204@gmail.com'></TextInput>
                <TextInput disabled size="xl" leftContent={<Label className={styles.leftContent} size="m">Gender</Label>} value='Female'></TextInput>
            </Card>

        </section>
    )
}