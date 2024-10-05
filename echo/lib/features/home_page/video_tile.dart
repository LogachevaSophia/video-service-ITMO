import 'package:echo/features/home_page/fade_transition_widget.dart';
import 'package:echo/models/video.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class VideoTile extends StatelessWidget {
  const VideoTile({
    super.key,
    required this.video,
    this.onTap,
  });

  final Video video;
  final VoidCallback? onTap;

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
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Container(
          color: const Color(0xFFF2F2F7),
          child: Column(
            children: [
              if (video.preview != null)
                LayoutBuilder(builder: (context, constraints) {
                  return Container(
                    height: constraints.maxWidth * 9 / 16,
                    width: constraints.maxWidth,
                    color: Colors.black,
                    child: Image.network(
                      video.preview ?? '',
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
              if (video.preview == null) _buildPlaceholder(context),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
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
                      video.name ?? 'Без названия',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
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
