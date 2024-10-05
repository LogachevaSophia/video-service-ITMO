import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class BottomBarItem extends StatelessWidget {
  final bool isSelected;
  final String iconPath;

  const BottomBarItem({
    super.key,
    required this.isSelected,
    required this.iconPath,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 36,
      width: 36,
      // rounded rectangle
      decoration: BoxDecoration(
        color: isSelected ? Colors.white : Colors.transparent.withOpacity(0.05),
        borderRadius: const BorderRadius.all(Radius.circular(16)),
      ),
      child: Center(
        child: SvgPicture.asset(
          iconPath,
          color: isSelected ? const Color(0xFF2A4E75) : Colors.white,
          height: 16,
        ),
      ),
    );
  }
}
