import 'package:dio/dio.dart';
import 'package:echo/dependencies/inherited_dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/storage.dart';
import 'package:flutter/material.dart';

class Dependencies {
  Dependencies({
    required this.dio,
    required this.authService,
    required this.secureStorage,
  });

  final Dio dio;
  final AuthService authService;
  final SecureStorage secureStorage;

  static Dependencies of(BuildContext context) {
    return InheritedDependencies.of(context);
  }
}
