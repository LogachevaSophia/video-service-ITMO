import 'package:chewie/chewie.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:video_player/video_player.dart';

import '../../models/video.dart';

class RoomPage extends StatefulWidget {
  const RoomPage({super.key, required this.roomId, required this.video});

  final String roomId;
  final Video video;
  static const routeName = '/roomPage';

  @override
  State<RoomPage> createState() => _RoomPageState();
}

class _RoomPageState extends State<RoomPage> {
  late VideoPlayerController _controller;
  ChewieController? _chewieController;
  late IO.Socket socket;

  @override
  void initState() {
    super.initState();

    // Initialize video controller
    _controller = VideoPlayerController.networkUrl(
      Uri.parse(widget.video.link.isNotEmpty
          ? widget.video.link
          : 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4'),
    )..initialize().then((_) {
        setState(() {
          _chewieController = ChewieController(
            videoPlayerController: _controller,
            autoPlay: false,
            looping: false,
          );
        });
      });

    // Initialize socket connection
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    // Join the room
    socket.on('connect', (_) {
      print('Connected to the server');
      socket.emit('join_room', widget.roomId);
    });

    // Listen for sync_video event
    socket.on('sync_video', (data) {
      String action = data['action'];
      print('Sync video action: $action');

      if (action == 'start') {
        _controller.play();
      } else if (action == 'stop') {
        _controller.pause();
      }
    });

    // Listen for video player state changes
    _controller.addListener(_videoListener);

    // Error handling
    socket.on('error', (err) => print('Error: $err'));
  }

  @override
  void dispose() {
    _controller.removeListener(_videoListener);
    _controller.dispose();
    _chewieController?.dispose();
    socket.dispose();
    super.dispose();
  }

  void _videoListener() {
    if (_controller.value.isPlaying) {
      // Emit 'start' when the video is playing
      socket.emit('video_action', {'roomId': widget.roomId, 'action': 'start'});
    } else if (_controller.value.position == _controller.value.duration) {
      // Do nothing when the video finishes
    } else {
      // Emit 'stop' when the video is paused
      socket.emit('video_action', {'roomId': widget.roomId, 'action': 'stop'});
    }
  }

  @override
  Widget build(BuildContext context) {
    final chewieController = _chewieController;

    return Scaffold(
      appBar: AppBar(
        title: Text('Room number ${widget.roomId}'),
      ),
      body: SafeArea(
        child: Scaffold(
          body: chewieController != null
              ? Chewie(controller: chewieController)
              : const SizedBox(),
          floatingActionButton: FloatingActionButton(
            onPressed: () async {
              await Clipboard.setData(ClipboardData(text: widget.roomId));
              SnackBarService.showSnackBar(
                  context, 'Copied to clipboard!', false);
            },
            child: const Icon(Icons.person_add_alt_1),
          ),
        ),
      ),
    );
  }
}
