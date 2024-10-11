import 'dart:async';
import 'dart:developer';

import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/dependencies/inherited_dependencies.dart';
import 'package:echo/dependencies/initialize_dependencies.dart';
import 'package:echo/features/join_page/join_page.dart';
import 'package:echo/features/login_page/login_page.dart';
import 'package:echo/features/room_page/room_page.dart';
import 'package:echo/features/room_page/room_page_interface.dart';
import 'package:echo/features/video_page/video_page.dart';
import 'package:echo/models/video.dart';
import 'package:echo/services/auth_service.dart';
import 'package:flutter/material.dart';

import 'features/main_page/main_page.dart';
import 'features/register_page/register_page.dart';

void main() async {
  runZonedGuarded(() async {
    final dependencies = await initializeDependencies();

    runApp(
      MyApp(
        dependencies: dependencies,
      ),
    );
  }, (object, stackTrace) {
    log(object.toString(), stackTrace: stackTrace);
  });
}

class MyApp extends StatefulWidget {
  final Dependencies dependencies;

  const MyApp({
    super.key,
    required this.dependencies,
  });

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late final Future<String?> userFuture;

  @override
  void initState() {
    super.initState();
    userFuture = checkToken();
  }

  @override
  Widget build(BuildContext context) {
    return InheritedDependencies(
      dependencies: widget.dependencies,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        home: FutureBuilder<String?>(
          future: userFuture,
          builder: (BuildContext context, AsyncSnapshot<String?> snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              String? user = snapshot.data;
              return Navigator(
                initialRoute:
                    user == null ? LoginPage.routeName : MainPage.routeName,
                onGenerateRoute: (RouteSettings settings) {
                  if (settings.name == MainPage.routeName) {
                    return MaterialPageRoute(
                        builder: (context) => const MainPage());
                  } else if (settings.name == LoginPage.routeName) {
                    return MaterialPageRoute(
                        builder: (context) => const LoginPage());
                  } else if (settings.name == RegisterPage.routeName) {
                    return MaterialPageRoute(
                        builder: (context) => const RegisterPage());
                  } else if (settings.name == VideoPage.routeName) {
                    return MaterialPageRoute(
                      builder: (context) => VideoPage(
                        video: settings.arguments as Video,
                      ),
                    );
                  } else if (settings.name == RoomPage.routeName) {
                    final data = settings.arguments as RoomPageInterface;
                    return MaterialPageRoute(
                        builder: (context) =>
                            RoomPage(roomId: data.roomId, video: data.video));
                  } else if (settings.name == JoinPage.routeName) {
                    return MaterialPageRoute(
                        builder: (context) => const JoinPage());
                  }
                  return null;
                },
              );
            } else {
              return const Scaffold(
                body: Center(
                  child: CircularProgressIndicator(),
                ),
              );
            }
          },
        ),
      ),
    );
  }

  Future<String?> checkToken() async {
    AuthService auth = widget.dependencies.authService;
    String? token = await auth.check();

    return token;
  }
}
