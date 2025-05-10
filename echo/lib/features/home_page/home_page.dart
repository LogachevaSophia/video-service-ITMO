import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/features/home_page/video_tile.dart';
import 'package:echo/models/state.dart';
import 'package:echo/models/video.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  AppState<List<Video>> videosState = const AppState(
    data: [],
    status: AppStateStatus.initial,
  );

  @override
  void initState() {
    super.initState();
    fetchVideos();
  }

  Future<void> fetchVideos() async {
    setState(() {
      videosState = videosState.copyWith(status: AppStateStatus.loading);
    });
    try {
      final videoService = Dependencies.of(context).videoService;
      final videos = await videoService.fetchVideos();

      setState(() {
        videosState = AppState(data: videos, status: AppStateStatus.loaded);
      });
    } catch (e) {
      setState(() {
        videosState = videosState.copyWith(status: AppStateStatus.error);
      });
    }

    setState(() {
      videosState = videosState.copyWith(status: AppStateStatus.initial);
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
        child: SafeArea(
          child: Column(
            children: [
              if (videosState.status == AppStateStatus.loading)
                const LinearProgressIndicator(),
              if (videosState.data.isEmpty &&
                  videosState.status != AppStateStatus.loading)
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('Видео не найдены'),
                        ElevatedButton(
                          onPressed: fetchVideos,
                          child: const Text('Попробовать снова'),
                        ),
                      ],
                    ),
                  ),
                ),
              if (videosState.data.isNotEmpty)
                Expanded(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      if (constraints.maxWidth > 600) {
                        return GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                            childAspectRatio: 16 / 9,
                          ),
                          itemCount: videosState.data.length,
                          itemBuilder: (context, index) {
                            final video = videosState.data[index];
                            return VideoTile(
                              video: video,
                              onTap: () {
                                final uri = Uri(
                                  path: '/home/video/${video.id}',
                                );
                                GoRouter.of(context).go(uri.toString());
                              },
                            );
                          },
                        );
                      } else {
                        return ListView.separated(
                          itemCount: videosState.data.length,
                          itemBuilder: (context, index) {
                            final video = videosState.data[index];
                            return VideoTile(
                              video: video,
                              onTap: () {
                                final uri = Uri(
                                  path: '/home/video/${video.id}',
                                );
                                GoRouter.of(context).go(uri.toString());
                              },
                            );
                          },
                          separatorBuilder: (context, index) {
                            return const SizedBox(height: 10);
                          },
                        );
                      }
                    },
                  ),
                ),
              ElevatedButton(
                onPressed: () async {
                  final result = await FilePicker.platform.pickFiles(
                    type: FileType.video,
                    allowMultiple: false,
                  );

                  if (result == null) {
                    return;
                  }

                  final videoService = Dependencies.of(context).videoService;

                  for (var file in result.files) {
                    final bytes = file.bytes;

                    if (bytes == null) {
                      continue;
                    }

                    final videoId = await videoService.uploadVideo(
                      MultipartFile.fromBytes(
                        bytes,
                        filename: file.name,
                        contentType: MediaType.parse(
                          lookupMimeType(file.name) ?? 'video/mp4',
                        ),
                      ),
                    );

                    SnackBarService.showSnackBar(
                      context,
                      'Видео загружено',
                      false,
                    );

                    final uri = Uri(
                      path: '/home/video/$videoId',
                    );

                    GoRouter.of(context).go(uri.toString());
                  }
                },
                child: const Text('Загрузить видео'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
