import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/auth_storage.dart';
import 'package:echo/services/const.dart';
import 'package:echo/services/storage.dart';
import 'package:echo/services/token_interceptor.dart';

Future<Dependencies> initializeDependencies() async {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://${Const.ipurl}:${Const.port}',
    ),
  );
  final SecureStorage secureStorage = SecureStorage();
  final TokenInterceptor tokenInterceptor = TokenInterceptor(
    secureStorage: secureStorage,
  );
  dio.interceptors.add(tokenInterceptor);

  return Dependencies(
    dio: dio,
    authService: AuthService(
      dio: dio,
      authStorage: AuthStorage(
        secureStorage: secureStorage,
        tokenInterceptor: tokenInterceptor,
      ),
    ),
    secureStorage: secureStorage,
  );
}
