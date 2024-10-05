import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/storage.dart';

Future<Dependencies> initializeDependencies() async {
  final Dio dio = Dio();
  final SecureStorage secureStorage = SecureStorage();

  return Dependencies(
    dio: dio,
    authService: AuthService(
      dio: dio,
      secureStorage: secureStorage,
    ),
    secureStorage: secureStorage,
  );
}
