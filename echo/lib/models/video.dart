class Video {
  final String? name;
  final String link;
  final String? preview;

  Video({
    required this.name,
    required this.link,
    this.preview,
  });

  factory Video.fromJson(Map<String, dynamic> json) {
    return Video(
      name: json['Name'],
      link: json['Link'],
    );
  }
}
