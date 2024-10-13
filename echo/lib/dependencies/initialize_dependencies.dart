import 'package:dio/dio.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/auth_state_manager.dart';
import 'package:echo/services/auth_storage.dart';
import 'package:echo/services/const.dart';
import 'package:echo/services/room_service.dart';
import 'package:echo/services/storage.dart';
import 'package:echo/services/token_interceptor.dart';
import 'package:echo/services/video_service.dart';

Future<Dependencies> initializeDependencies() async {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
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
    videoService: VideoService(
      dio: dio,
    ),
    secureStorage: secureStorage,
    roomService: RoomService(dio: dio),
    authStateManager: AuthStateManager(
      AuthState(
        isAuthenticated: false,
      ),
    ),
  );
}
