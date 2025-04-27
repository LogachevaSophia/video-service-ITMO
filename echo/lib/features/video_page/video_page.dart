import 'package:collection/collection.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/features/video_page/video_page_player.dart';
import 'package:echo/models/state.dart';
import 'package:flutter/material.dart';

import '../../models/video.dart';

class VideoPage extends StatefulWidget {
  const VideoPage({super.key, required this.videoId, required this.video});

  final int videoId;
  final Video? video;
  static const routeName = '/roomPage';

  @override
  State<VideoPage> createState() => _VideoPageState();
}

class _VideoPageState extends State<VideoPage> {
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

    final videoService = Dependencies.of(context).videoService;
    final videos = await videoService.fetchVideos();

    final video =
        videos.firstWhereOrNull((element) => element.id == widget.videoId);

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

    return VideoPagePlayer(
      video: currentVideo,
    );
  }
}
