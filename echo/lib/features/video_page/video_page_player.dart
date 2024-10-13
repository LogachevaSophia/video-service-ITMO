import 'package:chewie/chewie.dart';
import 'package:echo/models/video.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

/// {@template video_page}
/// VideoPage widget
/// {@endtemplate}
class VideoPagePlayer extends StatefulWidget {
  final Video video;

  /// {@macro video_page}
  const VideoPagePlayer({
    super.key,
    required this.video,
  });
  static const routeName = '/video';

  @override
  State<VideoPagePlayer> createState() => _VideoPagePlayerState();
}

class _VideoPagePlayerState extends State<VideoPagePlayer> {
  late VideoPlayerController _controller;
  ChewieController? _chewieController;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(
      Uri.parse(widget.video.link.isNotEmpty
          ? widget.video.link
          : 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4'),
    )..initialize().then((_) {
        // Ensure the first frame is shown after the video is initialized, even before the play button has been pressed.
        setState(() {
          _chewieController = ChewieController(
            videoPlayerController: _controller,
            autoPlay: false,
            looping: false,
          );
        });
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chewieController = _chewieController;

    return Scaffold(
      body: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            title: Text(widget.video.name ?? 'Без названия'),
          ),
          body: chewieController != null
              ? Chewie(controller: chewieController)
              : const SizedBox(),
        ),
      ),
    );
  }
} // VideoPage
