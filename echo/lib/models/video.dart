// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:echo/models/video_chapter.dart';

class Video {
  final int id;
  final String? name;
  final String link;
  final String? preview;
  final List<VideoChapter>? chapters;
  final bool profanity;

  const Video({
    required this.id,
    required this.name,
    required this.link,
    this.chapters,
    this.preview,
    this.profanity = false,
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
      profanity: json['profanity'] ?? false,
    );
  }

  Video copyWith({
    int? id,
    String? name,
    String? link,
    String? preview,
    List<VideoChapter>? chapters,
    bool? profanity,
  }) {
    return Video(
      id: id ?? this.id,
      name: name ?? this.name,
      link: link ?? this.link,
      preview: preview ?? this.preview,
      chapters: chapters ?? this.chapters,
      profanity: profanity ?? this.profanity,
    );
  }
}
