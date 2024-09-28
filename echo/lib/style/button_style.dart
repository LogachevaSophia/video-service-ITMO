import 'package:flutter/material.dart';

class CustomButtonStyle {
  ButtonStyle? orangeButton = ButtonStyle(
    backgroundColor: MaterialStateProperty.all<Color>(const Color(0xff6b19ae)),
    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
    ),
  );
}