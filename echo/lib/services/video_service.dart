import 'package:dio/dio.dart';
import 'package:echo/models/video.dart';

class VideoService {
  final Dio dio;

  VideoService({required this.dio});

  Future<List<Video>> fetchVideos() async {
    try {
      final response = await dio.get('/video/getAll');
      final data = response.data['data'] as List;
      final videos = data.map<Video>((video) => Video.fromJson(video)).toList();
      return videos;
    } catch (e) {
      print("Error: $e");
      return [];
    }
  }
}
