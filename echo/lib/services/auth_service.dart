import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:echo/services/auth_storage.dart';
import 'package:flutter/cupertino.dart';
import 'package:echo/services/const.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:echo/services/storage.dart';

class AuthService {
  final Dio dio;
  final AuthStorage authStorage;

  AuthService({
    required this.dio,
    required this.authStorage,
  });

  Future<String?> login(
      String mail, String password, BuildContext context) async {
    try {
      final response = await dio.post(
        '/auth/login',
        data: json.encode(
          {
            'Email': mail,
            'Password': password,
          },
        ),
      );
      final data = response.data;
      print(response.data);
      final token = data['token'];
      if (response.statusCode == 200) {
        SnackBarService.showSnackBar(
            context, "Пользователь успешно вошёл!", false);
        await authStorage.saveToken(token);
        return token;
      } else {
        SnackBarService.showSnackBar(context, data["error"], true);
        return null;
      }
    } on SocketException {
      SnackBarService.showSnackBar(
          context, "Нет подключения к интернету", true);
      return null;
    } catch (e) {
      print("Error: $e");
      return null;
    }
  }

  Future<String?> register(
      String mail, String name, String password, BuildContext context) async {
    try {
      final response = await dio.post(
        '/auth/register',
        data: json.encode({
          'Email': mail,
          'Name': name,
          'Password': password,
        }),
      );

      final data = response.data;
      final token = data['token'];
      print(token);
      if (response.statusCode == 201) {
        await authStorage.saveToken(token);
        SnackBarService.showSnackBar(context, data['message'], false);
        return token;
      } else {
        SnackBarService.showSnackBar(context, data['message'], false);
        return null;
      }
    } on SocketException {
      SnackBarService.showSnackBar(
          context, "Нет подключения к интернету", true);
      return null;
    } catch (e) {
      print("Error: $e");
      SnackBarService.showSnackBar(context, "$e", true);
      return null;
    }
  }

  Future<String?> check() async {
    final token = await authStorage.getToken();
    if (token != null) {
      final response = await dio.get(
        '/auth/check',
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );
      final data = response.data;
      if (response.statusCode == 200) {
        final token = data['token'];

        print(token);

        if (token != null) {
          await authStorage.saveToken(token);
        }

        return token;
      } else {
        return null;
      }
    }
    return null;
  }

  Future<void> logout() async {
    final token = await authStorage.deleteToken();
    return token;
  }
}
