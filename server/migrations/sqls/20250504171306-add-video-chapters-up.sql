CREATE TABLE video_chapter (
    id int NOT NULL AUTO_INCREMENT,
    video_id int NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time INT NOT NULL,
    end_time INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (video_id) REFERENCES video(Id) ON DELETE CASCADE
);