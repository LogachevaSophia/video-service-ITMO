import { Button, Card, TextInput } from '@gravity-ui/uikit';
import React from 'react';
import { useForm } from 'react-hook-form';
import styles from "./AddVideoForm.module.css"
import { VideoItem } from '../ListVideos/ListVideos';
interface VideoFormProps {
  onAddVideo: (video: VideoItem) => void;
}

interface FormInputs {
  title: string;
  description: string;
  cost: number;
  link: string;
}

export const AddVideoForm: React.FC<VideoFormProps> = ({ onAddVideo }) => {
  const { register, getValues, reset } = useForm<FormInputs>();

  // Обработчик кнопки сохранения видео
  const handleSaveVideo = () => {
    const values: VideoItem = getValues(); // Получаем значения полей
    console.log(values)
    if (values.title && values.description && values.cost && values.link) {
      onAddVideo(values); // Передаем данные в onAddVideo
      reset(); // Очищаем форму после добавления видео
    } else {
      console.log('All fields are required!');
    }
  };

  return (
    <Card type="container" view="outlined">
      <section className={styles.form}>
        <TextInput placeholder="Title" {...register("title", { required: true })} />
        <TextInput placeholder="Description" {...register("description", { required: true })} />
        <TextInput type="number" placeholder="Cost" {...register("cost", { required: true })} />
        <TextInput placeholder="Link" {...register("link", { required: true })} />

        <Button type="button" view="action" onClick={handleSaveVideo}>Save Video</Button>
      </section>
    </Card>
  );
};
