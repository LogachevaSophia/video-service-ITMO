class Video {
  final int id;
  final String? name;
  final String link;
  final String? preview;

  Video({
    required this.id,
    required this.name,
    required this.link,
    this.preview,
  });

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      id: json['Id'],
      name: json['Name'],
      link: json['Link'],
      preview: json['Preview'],
    );
  }
}
