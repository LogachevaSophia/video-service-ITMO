import 'package:echo/dependencies/dependencies.dart';
import 'package:flutter/material.dart';
import 'package:echo/features/main_page/main_page.dart';
import 'package:echo/features/register_page/register_page.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/storage.dart';
import 'package:echo/style/style_library.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:ionicons/ionicons.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);
  static const routeName = '/loginPage';

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _obscureText = true;

  TextEditingController emailTextInputController = TextEditingController();
  TextEditingController passwordTextInputController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    emailTextInputController.dispose();
    passwordTextInputController.dispose();

    super.dispose();
  }

  void _toggle() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  Future<void> login() async {
    final isValid = formKey.currentState!.validate();
    if (!isValid) return;
    AuthService authService = Dependencies.of(context).authService;
    String? token = await authService.login(
        emailTextInputController.text.trim(),
        passwordTextInputController.text.trim(),
        context);
    if (token != null) {
      Navigator.pushNamedAndRemoveUntil(
          context, MainPage.routeName, (Route<dynamic> route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: screenHeight * 0.15),
              SvgPicture.asset(
                'assets/images/Logo.svg',
                height: screenHeight * 0.1,
              ),
              SizedBox(height: 40),
              Form(
                key: formKey,
                child: Column(
                  children: [
                    Container(
                      alignment: Alignment.centerLeft,
                      margin: const EdgeInsets.only(top: 50),
                      child: Opacity(
                        opacity: 0.7,
                        child: Text(
                          'Почта',
                          style: TextStyle(
                              fontFamily: 'Source Sans Pro',
                              fontSize: 12,
                              color: StyleLibrary.color.lightGray),
                        ),
                      ),
                    ),
                    TextFormField(
                      decoration: InputDecoration(
                        hintText: 'Например: test@test.test',
                        hintStyle:
                            TextStyle(color: StyleLibrary.color.lightGray),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 10),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      controller: emailTextInputController,
                      validator: (value) {
                        if (value == null) {
                          return 'Пожалуйста введите почту';
                        } else if (!RegExp(
                                r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$')
                            .hasMatch(value)) {
                          return 'Пожалуйста введите корректную почту';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 20),
                    Container(
                      alignment: Alignment.centerLeft,
                      margin: const EdgeInsets.only(top: 35),
                      child: Opacity(
                        opacity: 0.7,
                        child: Text(
                          'Пароль',
                          style: TextStyle(
                              fontFamily: 'Source Sans Pro',
                              fontSize: 12,
                              color: StyleLibrary.color.lightGray),
                        ),
                      ),
                    ),
                    TextFormField(
                      controller: passwordTextInputController,
                      obscureText: _obscureText,
                      decoration: InputDecoration(
                        suffixIcon: IconButton(
                            onPressed: _toggle,
                            icon: Icon(_obscureText
                                ? Ionicons.eye_sharp
                                : Ionicons.eye_off_sharp)),
                        hintText: 'Введите пароль',
                        hintStyle:
                            TextStyle(color: StyleLibrary.color.lightGray),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 10),
                      ),
                      validator: (value) => value != null && value.length < 5
                          ? 'Минимум 6 символов'
                          : null,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                    ),
                    TextButton(
                      style: ButtonStyle(
                          padding: MaterialStateProperty.all<EdgeInsets>(
                              EdgeInsets.zero)),
                      onPressed: () {},
                      child: Text(
                        'Забыли пароль?',
                        style: TextStyle(
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Нет аккаунта?'),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(
                                context, RegisterPage.routeName);
                          },
                          child: Text(
                            'Зарегистрируйтесь',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Войти',
                          style: TextStyle(color: Colors.black),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
