import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:appmetrica_plugin/appmetrica_plugin.dart';
import 'package:echo/analytics/analytics_repository.dart';
import 'package:echo/analytics/app_navigator_observer.dart';
import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/dependencies/inherited_dependencies.dart';
import 'package:echo/dependencies/initialize_dependencies.dart';
import 'package:echo/features/home_page/home_page.dart';
import 'package:echo/features/join_page/join_page.dart';
import 'package:echo/features/loading/loading_page.dart';
import 'package:echo/features/login_page/login_page.dart';
import 'package:echo/features/personal_data/personal_data.dart';
import 'package:echo/features/profile_page/profile_page.dart';
import 'package:echo/features/register_page/register_page.dart';
import 'package:echo/features/room_page/room_page.dart';
import 'package:echo/features/video_page/video_page.dart';
import 'package:echo/models/video.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'features/main_page/main_page.dart';
import 'package:go_router/go_router.dart';

final observer = AppNavigatorObserver(
  analyticsRepository: AnalyticsRepository.instance,
);
final shellObserver = AppNavigatorObserver(
  analyticsRepository: AnalyticsRepository.instance,
);

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();
// GoRouter configuration
final _router = GoRouter(
  initialLocation: '/home',
  navigatorKey: _rootNavigatorKey,
  routes: [
    ShellRoute(
      observers: [shellObserver],
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) => MainPage(
        child,
      ),
      redirect: (context, state) {
        if (!Dependencies.of(context).authStateManager.value.isAuthenticated) {
          return '/loading?redirect=${state.uri.path}';
        }

        return null;
      },
      routes: [
        GoRoute(
            path: '/home',
            builder: (context, state) => const HomePage(),
            routes: [
              GoRoute(
                path: '/video/:videoId',
                builder: (context, state) {
                  return VideoPage(
                    videoId: int.parse(
                      state.pathParameters['videoId'] as String,
                    ),
                    video: state.extra as Video?,
                  );
                },
              ),
            ]),
        GoRoute(
          path: '/room',
          builder: (context, state) => const JoinPage(),
          routes: [
            GoRoute(
              path: '/:roomId',
              builder: (context, state) => RoomPage(
                roomId: state.pathParameters['roomId'].toString(),
                video: state.extra as Video?,
              ),
            ),
          ],
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfilePage(),
          routes: [
            GoRoute(
              path: '/data',
              builder: (context, state) {
                return const PersonalData();
              },
            )
          ],
        ),
      ],
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) {
        return const LoginPage();
      },
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) {
        return const RegisterPage();
      },
    ),
    GoRoute(
      path: '/loading',
      builder: (context, state) {
        return const LoadingPage();
      },
    ),
  ],
  observers: [
    observer,
  ],
);

void main() async {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    if (Platform.isAndroid || Platform.isIOS) {
      await AppMetrica.activate(
        const AppMetricaConfig(
          "176e8169-e16d-479a-b444-6ce88a727e32",
        ),
      );
    }

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
  @override
  void initState() {
    super.initState();

    // close keyboard when tap outside of text field
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }

  @override
  Widget build(BuildContext context) {
    return InheritedDependencies(
      dependencies: widget.dependencies,
      child: MaterialApp.router(
        routerConfig: _router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
