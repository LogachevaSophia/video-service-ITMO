import 'package:dio/dio.dart';
import 'package:echo/services/storage.dart';

class TokenInterceptor extends QueuedInterceptor {
  final SecureStorage secureStorage;
  String? token;

  TokenInterceptor({required this.secureStorage});

  void setToken(String token) {
    this.token = token;
  }

  void deleteToken() {
    token = null;
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (token != null) {
      options.headers['Authorization'] = token;
    }
    handler.next(options);
  }
}
