// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

class VideoChapter {
  final int id;
  final String title;
  final String? description;
  final int startTime;
  final int endTime;

  VideoChapter({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'title': title,
      'description': description,
      'start_time': startTime,
      'end_time': endTime,
    };
  }

  factory VideoChapter.fromMap(Map<String, dynamic> map) {
    return VideoChapter(
      id: map['id'] as int,
      title: map['title'] as String,
      description:
          map['description'] != null ? map['description'] as String : null,
      startTime: map['start_time'] as int,
      endTime: map['end_time'] as int,
    );
  }

  String toJson() => json.encode(toMap());

  factory VideoChapter.fromJson(String source) =>
      VideoChapter.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'VideoChapter(id: $id, title: $title, description: $description, startTime: $startTime, endTime: $endTime)';
  }
}
