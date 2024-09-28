import 'package:flutter/material.dart';
import 'package:echo/features/login_page/login_page.dart';
import 'package:echo/features/personal_data/personal_data.dart';
import 'package:echo/style/style_library.dart';

import '../../services/storage.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    final SecureStorage secureStorage = SecureStorage();
    return Scaffold(
      body: SingleChildScrollView(
        child: SafeArea(
          child: Container(
            alignment: Alignment.topCenter,
            child: Column(
              children: [
                const Icon(
                  Icons.supervised_user_circle,
                  size: 150,
                ),
                Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff6b19ae),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      padding: const EdgeInsets.all(5),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => PersonalData()),
                      );
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Align(
                            alignment: Alignment.center,
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 15),
                              child: Text('Личные данные',
                                  style: StyleLibrary.text.white25),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff8B0000),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      padding: const EdgeInsets.all(5),
                    ),
                    onPressed: () {
                      secureStorage.writeSecureData('token', '');
                      Navigator.pushNamedAndRemoveUntil(context,
                          LoginPage.routeName, (Route<dynamic> route) => false);
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Align(
                            alignment: Alignment.center,
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 15),
                              child: Text('Выйти',
                                  style: StyleLibrary.text.white25),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
