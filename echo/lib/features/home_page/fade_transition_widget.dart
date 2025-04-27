import 'package:flutter/material.dart';

/// {@template fade_transition_widget}
/// FadeTransitionWidget widget
/// {@endtemplate}
class FadeTransitionWidget extends StatefulWidget {
  const FadeTransitionWidget({
    required this.duration,
    required this.curve,
    required this.child,
    super.key,
  });

  final Duration duration;

  final Curve curve;

  final Widget child;

  @override
  State<FadeTransitionWidget> createState() => _FadeTransitionWidgetState();
} // FadeTransitionWidget

/// State for widget FadeTransitionWidget
class _FadeTransitionWidgetState extends State<FadeTransitionWidget>
    with TickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: widget.duration,
    vsync: this,
  )..animateTo(1.0);
  late final CurvedAnimation _animation = CurvedAnimation(
    parent: _controller,
    curve: widget.curve,
  );

  @override
  void didUpdateWidget(FadeTransitionWidget oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.duration != widget.duration) {
      _controller
        ..duration = widget.duration
        ..animateTo(1.0);
    }

    if (oldWidget.curve != widget.curve) {
      _animation.curve = widget.curve;
    }
  }

  @override
  void dispose() {
    _animation.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: widget.child,
    );
  }
} // _FadeTransitionWidgetState
