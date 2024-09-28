import 'dart:convert';
import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:echo/services/const.dart';
import 'package:echo/services/snack_bar.dart';
import 'package:echo/services/storage.dart';
import 'package:http/http.dart' as http;

class AuthService {
  Future<String?> login(
      String mail, String password, BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse('http://${Const.ipurl}:${Const.port}/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'mail': mail,
          'password': password,
        }),
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        SnackBarService.showSnackBar(
            context, "Пользователь успешно вошёл!", false);
        return data['access_token'];
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

  Future<String?> register(String mail, String name,
     String password, BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse('http://${Const.ipurl}:${Const.port}/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'mail': mail,
          'name': name,
          'password': password,
        }),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        SnackBarService.showSnackBar(
            context, 'Пользователь успешно зарегистрирован!', false);
        return data['access_token'];
      } else {
        SnackBarService.showSnackBar(context, data['error'], true);
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

  Future<String?> check() async {
    final SecureStorage secureStorage = SecureStorage();
    final token = await secureStorage.readSecureData('token');
    if (token != null) {
      final response = await http.post(
        Uri.parse('http://${Const.ipurl}:${Const.port}/auth/check'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"token": token}),
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        return data['access_token'];
      } else {
        return null;
      }
    }
  }

}
