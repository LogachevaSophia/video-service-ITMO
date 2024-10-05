import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/services/auth_service.dart';

Future<Dependencies> initializeDependencies() async {
  final Dio dio = Dio();

  return Dependencies(
    dio: dio,
    authService: AuthService(dio: dio),
  );
}
