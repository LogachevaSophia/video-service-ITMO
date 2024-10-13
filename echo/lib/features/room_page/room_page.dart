import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/features/room_page/room_page_player.dart';
import 'package:echo/models/state.dart';
import 'package:flutter/material.dart';

import '../../models/video.dart';

class RoomPage extends StatefulWidget {
  const RoomPage({super.key, required this.roomId, required this.video});

  final String roomId;
  final Video? video;
  static const routeName = '/roomPage';

  @override
  State<RoomPage> createState() => _RoomPageState();
}

class _RoomPageState extends State<RoomPage> {
  AppState<Video?> video = const AppState<Video?>(
    data: null,
    status: AppStateStatus.initial,
  );

  @override
  void initState() {
    super.initState();
    video = AppState(data: widget.video, status: AppStateStatus.initial);

    if (video.data == null) {
      fetchVideo();
    }
  }

  Future<void> fetchVideo() async {
    setState(() {
      this.video =
          AppState(data: this.video.data, status: AppStateStatus.loading);
    });

    final roomService = Dependencies.of(context).roomService;
    final video = await roomService.getVideoFromRoom(widget.roomId);

    setState(() {
      this.video = AppState(
        data: video,
        status: AppStateStatus.loaded,
      );
    });
    setState(() {
      this.video =
          AppState(data: this.video.data, status: AppStateStatus.initial);
    });
  }

  @override
  Widget build(BuildContext context) {
    final currentVideo = video.data;

    if (currentVideo == null && video.status == AppStateStatus.loading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (currentVideo == null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Произошла ошибка'),
              TextButton(
                onPressed: fetchVideo,
                child: const Text('Повторить'),
              ),
            ],
          ),
        ),
      );
    }

    return RoomPagePlayer(
      roomId: widget.roomId,
      video: currentVideo,
    );
  }
}
