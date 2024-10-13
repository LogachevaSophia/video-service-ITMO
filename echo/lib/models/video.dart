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

  factory Video.fromQueryParams(Map<String, dynamic> queryParams) {
    return Video(
      id: int.parse(queryParams['id']),
      name: queryParams['name'],
      link: Uri.decodeFull(queryParams['link']),
      preview: queryParams['preview'],
    );
  }

  Map<String, dynamic> toQueryParams() {
    return {
      'id': id.toString(),
      'name': name,
      'link': Uri.encodeFull(link),
      'preview': preview,
    };
  }
}
