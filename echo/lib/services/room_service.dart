import 'package:dio/dio.dart';

import '../models/video.dart';

class RoomService {
  final Dio dio;

  RoomService({required this.dio});

  Future<String> createRoom(int videoId, String videoLink) async {
    try {
      final response = await dio.post('/room/create',
          data: {"videoId": videoId, "videoLink": videoLink});
      final data = response.data['roomId'];
      return data;
    } catch (e) {
      print("Error: $e");
      return '';
    }
  }

  Future<Video> getVideoFromRoom(String roomId) async {
    try {
      final response =
          await dio.get('/room/getVideo', queryParameters: {"roomId": roomId});
      final data = response.data;
      return Video(id: data['videoId'], name: '', link: data['videoLink']);
    } catch (e) {
      print("Error: $e");
      rethrow;
    }
  }
}
