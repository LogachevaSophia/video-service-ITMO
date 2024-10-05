import 'package:echo/services/storage.dart';
import 'package:echo/services/token_interceptor.dart';

class AuthStorage {
  final SecureStorage _secureStorage;
  final TokenInterceptor _tokenInterceptor;

  AuthStorage(
      {required SecureStorage secureStorage,
      required TokenInterceptor tokenInterceptor})
      : _secureStorage = secureStorage,
        _tokenInterceptor = tokenInterceptor;

  Future<void> saveToken(String token) async {
    await _secureStorage.writeSecureData('token', token);
    _tokenInterceptor.setToken(token);
  }

  Future<String?> getToken() async {
    final token = await _secureStorage.readSecureData('token');
    _tokenInterceptor.setToken(token);
    return token;
  }

  Future<void> deleteToken() async {
    _tokenInterceptor.deleteToken();
    await _secureStorage.deleteSecureData('token');
  }
}
