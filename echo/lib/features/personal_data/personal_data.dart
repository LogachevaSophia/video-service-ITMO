import 'package:flutter/material.dart';
import 'package:ionicons/ionicons.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import '../../services/storage.dart';
import '../../style/style_library.dart';

class PersonalData extends StatefulWidget {
  const PersonalData({super.key});

  @override
  State<PersonalData> createState() => _PersonalDataState();
}

class _PersonalDataState extends State<PersonalData> {
  Map<String, dynamic> data = {};

  Future<String?> getTokenFromSecureStorage() async {
    final storage = SecureStorage();
    String? token = await storage.readSecureData('token');
    return token;
  }

  Map<String, dynamic> decodeToken(String token) {
    return JwtDecoder.decode(token);
  }

  Future<void> initialize() async {
    final token = await getTokenFromSecureStorage();
    if (token != null) {
      setState(() {
        data = decodeToken(token);
      });
    }
  }

  @override
  void initState() {
    initialize();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    print(data);
    return Scaffold(
      backgroundColor: StyleLibrary.color.orange,
      body: SafeArea(
        child: SizedBox(
          height: MediaQuery.of(context).size.height,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.only(bottom: 36),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(
                        Ionicons.chevron_back,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                    Text(
                      'Персональная Информация',
                      style: StyleLibrary.text.white20,
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.only(left: 30, right: 30, top: 30),
                  decoration: const BoxDecoration(
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(30),
                      topLeft: Radius.circular(30),
                    ),
                    color: Colors.white,
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          alignment: Alignment.center,
                          margin: EdgeInsets.all(10),
                          child: Row(
                            children: [
                              Text(
                                "Почта:",
                                style: StyleLibrary.text.black20,
                              ),
                              Text(
                                '${data['email']}',
                                style: StyleLibrary.text.black16,
                              )
                            ],
                          ),
                        ),
                        Container(
                          alignment: Alignment.center,
                          margin: EdgeInsets.all(10),
                          child: Row(
                            children: [
                              Text(
                                "Имя:",
                                style: StyleLibrary.text.black20,
                              ),
                              Text(
                                '${data['name']}',
                                style: StyleLibrary.text.black16,
                              )
                            ],
                          ),
                        ),
                        Container(
                          alignment: Alignment.center,
                          margin: EdgeInsets.all(10),
                          child: Row(
                            children: [
                              Text(
                                "Фамилия:",
                                style: StyleLibrary.text.black20,
                              ),
                              Text(
                                '${data['surname']}',
                                style: StyleLibrary.text.black16,
                              )
                            ],
                          ),
                        ),
                        Container(
                          alignment: Alignment.center,
                          margin: EdgeInsets.all(10),
                          child: Row(
                            children: [
                              Text(
                                "Телефон:",
                                style: StyleLibrary.text.black20,
                              ),
                              Text(
                                '${data['phone']}',
                                style: StyleLibrary.text.black16,
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
