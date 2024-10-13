import 'package:chewie/chewie.dart';
import 'package:echo/features/video_page/controls/echo_controls.dart';
import 'package:echo/services/const.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:video_player/video_player.dart';

import '../../models/video.dart';

class RoomPagePlayer extends StatefulWidget {
  const RoomPagePlayer({super.key, required this.roomId, required this.video});

  final String roomId;
  final Video video;

  @override
  State<RoomPagePlayer> createState() => _RoomPagePlayerState();
}

class _RoomPagePlayerState extends State<RoomPagePlayer> {
  Video? video;

  late VideoPlayerController _controller;
  ChewieController? _chewieController;
  late Socket socket;

  Future<void> _onPlayPausePressed() async {
    if (_controller.value.isPlaying) {
      // Emit 'start' when the video is playing
      socket.emit('video_action', {
        'roomId': widget.roomId,
        'action': 'start',
        'currentTime': _controller.value.position.inMilliseconds / 1000,
      });
    } else if (_controller.value.position == _controller.value.duration) {
      // Do nothing when the video finishes
    } else {
      // Emit 'stop' when the video is paused
      socket.emit('video_action', {
        'roomId': widget.roomId,
        'action': 'stop',
        'currentTime': _controller.value.position.inMilliseconds / 1000,
      });
    }
  }

  @override
  void initState() {
    super.initState();

    // Initialize video controller
    _controller = VideoPlayerController.networkUrl(
      Uri.parse(widget.video.link.isNotEmpty
          ? widget.video.link
          : 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4'),
    )..initialize().then(
        (_) {
          setState(() {
            _chewieController = ChewieController(
              videoPlayerController: _controller,
              customControls: EchoControls(
                backgroundColor: Colors.black,
                iconColor: const Color.fromARGB(255, 200, 200, 200),
                onPlayPressed: _onPlayPausePressed,
                onSeek: (Duration seekTo) async {
                  socket.emit('video_action', {
                    'roomId': widget.roomId,
                    'action': 'seek',
                    'currentTime': seekTo.inMilliseconds / 1000,
                  });
                },
              ),
              autoPlay: false,
              looping: false,
            );
          });

          // Initialize socket connection
          socket = io(socketUrl, <String, dynamic>{
            'transports': ['websocket'],
            'autoConnect': false,
          });

          socket.connect();

          // Join the room
          socket.on('connect', (_) {
            print('Connected to the server');
            socket.emit('join_room', widget.roomId);
          });

          socket.on('sync_on_join', (data) {
            bool? isPlaying = data['isPlaying'];
            double? currentTimeInSeconds = data['currentTime'];

            if (isPlaying == null || currentTimeInSeconds == null) {
              return;
            }

            _controller.seekTo(
              Duration(
                milliseconds: (currentTimeInSeconds * 1000).round(),
              ),
            );

            if (isPlaying) {
              _controller.play();
            } else {
              _controller.pause();
            }
          });

          // Listen for sync_video event
          socket.on('sync_video', (data) {
            String action = data['action'];
            print('Sync video action: $action');

            double currentTimeInSeconds = data['currentTime'];

            _controller.seekTo(
                Duration(milliseconds: (currentTimeInSeconds * 1000).round()));

            if (action == 'start') {
              _controller.play();
            } else if (action == 'stop') {
              _controller.pause();
            }
          });

          socket.onAny((event, data) {
            print('$event: $data');
          });

          // Listen for video player state changes
          _controller.addListener(_videoListener);

          // Error handling
          socket.on('error', (err) => print('Error: $err'));
        },
      );
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
    print(_controller.value.position);
  }

  @override
  Widget build(BuildContext context) {
    final chewieController = _chewieController;

    return Scaffold(
      appBar: AppBar(
        title: Text('Комната номер ${widget.roomId}'),
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
