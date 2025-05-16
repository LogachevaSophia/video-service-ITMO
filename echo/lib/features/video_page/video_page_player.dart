import 'package:chewie/chewie.dart';
import 'package:collection/collection.dart';
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

    final chapters = widget.video.chapters?.sorted((a, b) {
      return a.startTime.compareTo(b.startTime);
    });

    String name = widget.video.name ?? 'Без названия';

    return Scaffold(
      body: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  name,
                  textAlign: TextAlign.center,
                ),
                if (widget.video.profanity)
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.info,
                        color: Colors.red,
                        size: 12,
                      ),
                      SizedBox(
                        width: 5,
                      ),
                      Text(
                        'Содержит ненормативную лексику',
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            actions: const [
              SizedBox(
                width: 48,
              )
            ],
          ),
          body: LayoutBuilder(builder: (context, constraints) {
            return CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Builder(builder: (
                    context,
                  ) {
                    if (chewieController == null) {
                      return SizedBox(
                        width: constraints.maxWidth,
                        height: constraints.maxWidth * 9 / 16,
                      );
                    }

                    return SizedBox(
                      width: constraints.maxWidth,
                      height: constraints.maxWidth * 9 / 16,
                      child: Chewie(
                        controller: chewieController,
                      ),
                    );
                  }),
                ),
                const SliverToBoxAdapter(
                  child: SizedBox(
                    height: 10,
                  ),
                ),
                if (chapters != null && chewieController != null)
                  ListenableBuilder(
                      listenable: chewieController.videoPlayerController,
                      builder: (
                        context,
                        snapshot,
                      ) {
                        final position = chewieController
                            .videoPlayerController.value.position;

                        return SliverList.builder(
                          itemCount: chapters.length,
                          itemBuilder: (context, index) {
                            final chapter = chapters[index];
                            final description = chapter.description;

                            final isCurrentChapter =
                                position.inMilliseconds >= chapter.startTime &&
                                    position.inMilliseconds <= chapter.endTime;

                            return ListTile(
                              title: Text(chapter.title),
                              // description in subtitle
                              subtitle: description != null
                                  ? Text(
                                      description,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    )
                                  : null,
                              selected: isCurrentChapter,
                              // startTime in ms to display time in seconds.
                              // For example, 31200 ms = 0:31
                              trailing: Text(
                                '${(chapter.startTime ~/ 1000) ~/ 60}:${((chapter.startTime ~/ 1000) % 60).toString().padLeft(2, '0')}',
                              ),

                              onTap: () {
                                _controller.seekTo(
                                  Duration(
                                    milliseconds: chapter.startTime,
                                  ),
                                );
                              },
                            );
                          },
                        );
                      }),
              ],
            );
          }),
        ),
      ),
    );
  }
} // VideoPage
