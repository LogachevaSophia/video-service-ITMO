import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/models/video.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class JoinPage extends StatefulWidget {
  const JoinPage({super.key});

  static const routeName = '/joinPage';

  @override
  State<JoinPage> createState() => _JoinPageState();
}

class _JoinPageState extends State<JoinPage> {
  TextEditingController roomIdController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    roomIdController.dispose();
    super.dispose();
  }

  Future<Video?> getVideoFromRoom(String roomId) async {
    try {
      final roomService = Dependencies.of(context).roomService;
      Video? video = await roomService.getVideoFromRoom(roomId);
      return video;
    } catch (e) {
      SnackBarService.showSnackBar(context, e.toString(), true);
    }
    return null;
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
              TextField(
                decoration: InputDecoration(
                  hintText: 'Введите идентификатор комнаты',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(vertical: 15, horizontal: 10),
                ),
                keyboardType: TextInputType.emailAddress,
                controller: roomIdController,
                onTapOutside: (event) {
                  FocusScope.of(context).unfocus();
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  final roomId = roomIdController.text.trim();
                  final video = await getVideoFromRoom(roomId);
                  if (video != null) {
                    GoRouter.of(context).go(
                      Uri(
                        path: '/room/$roomId',
                      ).toString(),
                      extra: video,
                    );
                  }
                },
                child: const Text('Присоединиться'),
              ),
              const SizedBox(height: 20),
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
                      'Видео загружено: $videoId',
                      false,
                    );
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
