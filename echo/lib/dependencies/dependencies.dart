import 'package:dio/dio.dart';
import 'package:echo/dependencies/inherited_dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:flutter/material.dart';

class Dependencies {
  Dependencies({
    required this.dio,
    required this.authService,
  });

  final Dio dio;
  final AuthService authService;

  static Dependencies of(BuildContext context) {
    return InheritedDependencies.of(context);
  }
}
