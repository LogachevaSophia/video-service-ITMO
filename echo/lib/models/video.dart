import 'package:echo/models/video_chapter.dart';

class Video {
  final int id;
  final String? name;
  final String link;
  final String? preview;
  final List<VideoChapter>? chapters;

  const Video({
    required this.id,
    required this.name,
    required this.link,
    this.chapters,
    this.preview,
  });

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      id: json['Id'],
      name: json['Name'],
      link: json['Link'],
      preview: json['Preview'],
      chapters: json['chapters'] != null
          ? (json['chapters'] as List)
              .map(
                (element) => VideoChapter.fromMap(
                  element,
                ),
              )
              .toList()
          : null,
    );
  }
}
