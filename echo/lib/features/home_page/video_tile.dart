import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/features/home_page/fade_transition_widget.dart';
import 'package:echo/models/video.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

class VideoTile extends StatefulWidget {
  const VideoTile({
    super.key,
    required this.video,
    this.onTap,
  });

  final Video video;
  final VoidCallback? onTap;

  @override
  State<VideoTile> createState() => _VideoTileState();
}

class _VideoTileState extends State<VideoTile> {
  Future<String> createRoom() async {
    final roomService = Dependencies.of(context).roomService;
    final roomId =
        await roomService.createRoom(widget.video.id, widget.video.link);
    return roomId;
  }

  Widget _buildPlaceholder(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          height: constraints.maxWidth * 9 / 16,
          color: Colors.black,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Container(
          color: const Color(0xFFF2F2F7),
          child: Column(
            children: [
              if (widget.video.preview != null)
                LayoutBuilder(builder: (context, constraints) {
                  return Container(
                    height: constraints.maxWidth * 9 / 16,
                    width: constraints.maxWidth,
                    color: Colors.black,
                    child: Image.network(
                      widget.video.preview ?? '',
                      fit: BoxFit.fill,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) {
                          return FadeTransitionWidget(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                            child: child,
                          );
                        }

                        return Container(
                          color: Colors.black,
                        );
                      },
                    ),
                  );
                }),
              if (widget.video.preview == null) _buildPlaceholder(context),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          height: 32,
                          width: 32,
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF3697F1),
                            borderRadius: BorderRadius.circular(50),
                          ),
                          child: Center(
                            child: SvgPicture.asset(
                              'assets/images/avatar_icon.svg',
                              width: 16,
                              height: 16,
                            ),
                          ),
                        ),
                        Text(
                          widget.video.name ?? 'Без названия',
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                    PopupMenuButton<int>(
                      icon: const Icon(Icons.more_vert), // Три точки
                      onSelected: (id) async {
                        // Действие по выбранному id
                        switch (id) {
                          case 1:
                            final roomId = await createRoom();
                            if (roomId == '') {
                              SnackBarService.showSnackBar(
                                  context, "Ошибка создания комнаты", true);
                            } else {
                              // serialize data to query params

                              GoRouter.of(context).go(
                                Uri(
                                  path: '/room/$roomId',
                                ).toString(),
                                extra: widget.video,
                              );
                            }
                            break;
                          case 3:
                            print('Добавить в плейлист');
                            break;
                          case 4:
                            print('Поделиться');
                            break;
                        }
                      },
                      itemBuilder: (BuildContext context) =>
                          <PopupMenuEntry<int>>[
                        const PopupMenuItem<int>(
                          value: 1, // ID для "Создать комнату"
                          child: ListTile(
                            leading: Icon(Icons.add),
                            title: Text('Создать комнату'),
                          ),
                        ),
                        // const PopupMenuItem<int>(
                        //   value: 2, // ID для "Добавить в избранное"
                        //   child: ListTile(
                        //     leading: Icon(Icons.favorite),
                        //     title: Text('Добавить в избранное'),
                        //   ),
                        // ),
                        // const PopupMenuItem<int>(
                        //   value: 3, // ID для "Добавить в плейлист"
                        //   child: ListTile(
                        //     leading: Icon(Icons.playlist_add),
                        //     title: Text('Добавить в плейлист'),
                        //   ),
                        // ),
                        // const PopupMenuItem<int>(
                        //   value: 4, // ID для "Поделиться"
                        //   child: ListTile(
                        //     leading: Icon(Icons.share),
                        //     title: Text('Поделиться'),
                        //   ),
                        // ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
