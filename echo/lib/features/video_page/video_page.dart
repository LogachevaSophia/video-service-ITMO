import 'package:chewie/chewie.dart';
import 'package:echo/models/video.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:socket_io_client/socket_io_client.dart';

/// {@template video_page}
/// VideoPage widget
/// {@endtemplate}
class VideoPage extends StatefulWidget {
  final Video video;

  /// {@macro video_page}
  VideoPage({
    super.key,
    required this.video,
  });
  static const routeName = '/video';

  @override
  State<VideoPage> createState() => _VideoPageState();
}

class _VideoPageState extends State<VideoPage> {
  late VideoPlayerController _controller;
  ChewieController? _chewieController;
  late Socket socket;

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
    socket = io(
      'http://89.169.175.33:5000',
      OptionBuilder()
          .setTransports(['websocket']) // for Flutter or Dart VM
          .disableAutoConnect() // disable auto-connection
          .build(),
    );
    socket.connect();
    socket.onConnect((_) {
      print('connect');
      socket.emit('join_room', widget.video.id);
      print('join_room ${widget.video.id}');
    });
    socket.onAny((String event, data) async {
      print(event);
      print(data);
    });
    socket.on('event', (data) => print(data));
    socket.onDisconnect((_) => print('disconnect'));
    socket.on('fromServer', (_) => print(_));
  }

  @override
  void dispose() {
    socket.disconnect();
    _controller.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chewieController = _chewieController;

    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Video'),
      // ),
      body: SafeArea(
        child: Scaffold(
          body: chewieController != null
              ? Chewie(controller: chewieController)
              : const SizedBox(),
          // floatingActionButton: FloatingActionButton(
          //   onPressed: () {
          //     setState(() {
          //       _controller.value.isPlaying
          //           ? _controller.pause()
          //           : _controller.play();
          //     });
          //   },
          //   child: Icon(
          //     _controller.value.isPlaying ? Icons.pause : Icons.play_arrow,
          //   ),
          // ),
        ),
      ),
    );
  }
} // VideoPage
