import 'package:flutter/material.dart';

class CustomButtonStyle {
  ButtonStyle? orangeButton = ButtonStyle(
    backgroundColor: WidgetStateProperty.all<Color>(const Color(0xff6b19ae)),
    shape: WidgetStateProperty.all<RoundedRectangleBorder>(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
    ),
  );
}
