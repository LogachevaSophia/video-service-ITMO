import 'package:echo/analytics/analytics_repository.dart';
import 'package:flutter/material.dart';

void logButtonPress(String analyticsName) {
  AnalyticsRepository.instance.logEvent(
    'button/press',
    {
      'button': {
        'name': analyticsName,
      },
    },
  );
}

/// {@template app_button}
/// AppButton widget
/// {@endtemplate}
class AppTextButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String text;
  final String analyticsName;

  /// {@macro app_button}
  const AppTextButton({
    super.key,
    required this.text,
    required this.analyticsName,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) => ElevatedButton(
        onPressed: () {
          logButtonPress(analyticsName);
          onPressed?.call();
        },
        child: Text(
          text,
        ),
      );
} // AppButton
