import 'package:echo/common/app_button.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:flutter/material.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/style/style_library.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:ionicons/ionicons.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);
  static const routeName = '/registerPage';

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool _obscureTextP = true;
  bool _obscureTextS = true;

  TextEditingController emailTextInputController = TextEditingController();
  TextEditingController passwordTextInputController = TextEditingController();
  TextEditingController nameTextInputController = TextEditingController();
  TextEditingController secondPasswordTextInputController =
      TextEditingController();
  final formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    emailTextInputController.dispose();
    passwordTextInputController.dispose();
    nameTextInputController.dispose();
    secondPasswordTextInputController.dispose();
    super.dispose();
  }

  void _toggleP() {
    setState(() {
      _obscureTextP = !_obscureTextP;
    });
  }

  void _toggleS() {
    setState(() {
      _obscureTextS = !_obscureTextS;
    });
  }

  Future<void> register() async {
    logButtonPress('register_button');
    final isValid = formKey.currentState!.validate();
    if (!isValid) return;
    AuthService authService = Dependencies.of(context).authService;
    String? token = await authService.register(
        emailTextInputController.text.trim(),
        nameTextInputController.text.trim(),
        passwordTextInputController.text.trim(),
        context);

    if (token == null) {
      return;
    }

    GoRouterState routerState = GoRouterState.of(context);
    String redirect = routerState.uri.queryParameters['redirect'] ?? '/home';

    GoRouter.of(context).go(redirect);
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    // final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () {
              GoRouter.of(context).go('/login');
            },
          ),
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(height: screenHeight * 0.05),
                  SvgPicture.asset(
                    'assets/images/Logo.svg',
                    height: screenHeight * 0.1,
                  ),
                  const SizedBox(height: 30),
                  Form(
                    key: formKey,
                    child: Column(
                      children: [
                        Container(
                          alignment: Alignment.centerLeft,
                          margin: const EdgeInsets.only(top: 10),
                          child: Opacity(
                            opacity: 0.7,
                            child: Text('Почта',
                                style: StyleLibrary.text.darkWhite12),
                          ),
                        ),
                        TextFormField(
                          decoration: InputDecoration(
                            hintText: 'Например: test@test.test',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                                vertical: 15, horizontal: 10),
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
                        Container(
                          alignment: Alignment.centerLeft,
                          margin: const EdgeInsets.only(top: 10),
                          child: Opacity(
                            opacity: 0.7,
                            child: Text('Имя',
                                style: StyleLibrary.text.darkWhite12),
                          ),
                        ),
                        TextFormField(
                          decoration: InputDecoration(
                            hintText: 'Введите ваше имя или никнейм',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                                vertical: 15, horizontal: 10),
                          ),
                          keyboardType: TextInputType.text,
                          controller: nameTextInputController,
                          validator: (value) {
                            if (value == null) {
                              return 'Пожалуйста введите имя';
                            }
                            // else if (!RegExp(r'^[a-zA-Zа-яА-ЯёЁ\s-]{2,30}$')
                            //     .hasMatch(value)) {
                            //   return 'Пожалуйста введите корректное имя';
                            // }
                            return null;
                          },
                        ),
                        Container(
                          alignment: Alignment.centerLeft,
                          margin: const EdgeInsets.only(top: 10),
                          child: Opacity(
                            opacity: 0.7,
                            child: Text('Пароль',
                                style: StyleLibrary.text.darkWhite12),
                          ),
                        ),
                        TextFormField(
                          obscureText: _obscureTextP,
                          decoration: InputDecoration(
                            hintText: 'Введите пароль',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            suffixIcon: IconButton(
                                onPressed: _toggleP,
                                icon: Icon(_obscureTextP
                                    ? Ionicons.eye_sharp
                                    : Ionicons.eye_off_sharp)),
                            contentPadding: const EdgeInsets.symmetric(
                                vertical: 15, horizontal: 10),
                          ),
                          controller: passwordTextInputController,
                        ),
                        Container(
                          alignment: Alignment.centerLeft,
                          margin: const EdgeInsets.only(top: 10),
                          child: Opacity(
                            opacity: 0.7,
                            child: Text('Подтвердите пароль',
                                style: StyleLibrary.text.darkWhite12),
                          ),
                        ),
                        TextFormField(
                          obscureText: _obscureTextS,
                          decoration: InputDecoration(
                              hintText: 'Введите пароль',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: IconButton(
                                  onPressed: _toggleS,
                                  icon: Icon(_obscureTextS
                                      ? Ionicons.eye_sharp
                                      : Ionicons.eye_off_sharp))),
                          controller: secondPasswordTextInputController,
                          validator: (value) {
                            if (value == null) {
                              return 'Пожалуйста подтвердите пароль';
                            } else if (value !=
                                passwordTextInputController.text) {
                              return 'Введенные вами пароли не совпадают';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 30),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: register,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              padding: const EdgeInsets.symmetric(vertical: 15),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Регистрация',
                              style: TextStyle(color: Colors.black),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Text(
                            'Нажимая зарегистрироваться вы соглашаетесь с условиями и политикой конфиденциальности',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ]),
          ),
        ));
  }
}
