import 'package:chewie/src/chewie_progress_colors.dart';
import 'package:echo/features/video_page/controls/echo_video_progress_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:video_player/video_player.dart';

class EchoCupertinoVideoProgressBar extends StatelessWidget {
  EchoCupertinoVideoProgressBar(
    this.controller, {
    ChewieProgressColors? colors,
    this.onDragEnd,
    this.onDragStart,
    this.onDragUpdate,
    super.key,
    this.draggableProgressBar = true,
    required this.onSeek,
  }) : colors = colors ?? ChewieProgressColors();

  final VideoPlayerController controller;
  final ChewieProgressColors colors;
  final Function()? onDragStart;
  final Function()? onDragEnd;
  final Function()? onDragUpdate;
  final ValueChanged<Duration> onSeek;
  final bool draggableProgressBar;

  @override
  Widget build(BuildContext context) {
    return EchoVideoProgressBar(
      controller,
      barHeight: 5,
      handleHeight: 6,
      drawShadow: true,
      colors: colors,
      onDragEnd: onDragEnd,
      onDragStart: onDragStart,
      onDragUpdate: onDragUpdate,
      draggableProgressBar: draggableProgressBar,
      onSeek: onSeek,
    );
  }
}
