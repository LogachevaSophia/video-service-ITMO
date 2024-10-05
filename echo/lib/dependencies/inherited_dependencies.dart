import 'package:echo/dependencies/dependencies.dart';
import 'package:flutter/material.dart';

class InheritedDependencies extends InheritedWidget {
  final Dependencies dependencies;

  const InheritedDependencies({
    super.key,
    required this.dependencies,
    required super.child,
  });

  static Dependencies of(BuildContext context) {
    return maybeOf(context) ?? _notFoundInheritedWidgetOfExactType();
  }

  static Dependencies? maybeOf(BuildContext context) {
    final InheritedDependencies? dependencies = context
        .getElementForInheritedWidgetOfExactType<InheritedDependencies>()
        ?.widget as InheritedDependencies?;
    return dependencies?.dependencies;
  }

  static Never _notFoundInheritedWidgetOfExactType() => throw ArgumentError(
        'Out of scope, not found inherited widget '
            'a InheritedDependencies of the exact type',
        'out_of_scope',
      );

  @override
  bool updateShouldNotify(covariant InheritedWidget oldWidget) {
    return false;
  }
}
