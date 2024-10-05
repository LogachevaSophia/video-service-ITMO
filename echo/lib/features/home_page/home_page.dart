import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/features/home_page/video_tile.dart';
import 'package:echo/models/video.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Video> videos = [];

  @override
  void initState() {
    super.initState();
    fetchVideos();
  }

  Future<void> fetchVideos() async {
    final videoService = Dependencies.of(context).videoService;
    final videos = await videoService.fetchVideos();

    setState(() {
      this.videos = videos;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 5,
          vertical: 7,
        ),
        child: ListView.separated(
          itemCount: videos.length,
          itemBuilder: (context, index) {
            final video = videos[index];
            return VideoTile(video: video);
          },
          separatorBuilder: (context, index) {
            return const SizedBox(height: 10);
          },
        ),
      ),
    );
  }
}
