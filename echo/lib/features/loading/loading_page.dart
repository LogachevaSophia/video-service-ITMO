import 'dart:developer';

import 'package:echo/dependencies/dependencies.dart';
import 'package:echo/services/auth_service.dart';
import 'package:echo/services/auth_state_manager.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

/// {@template loading_page}
/// LoadingPage widget
/// {@endtemplate}
class LoadingPage extends StatefulWidget {
  /// {@macro loading_page}
  const LoadingPage({super.key});

  @override
  State<LoadingPage> createState() => _LoadingPageState();
} // LoadingPage

/// State for widget LoadingPage
class _LoadingPageState extends State<LoadingPage> {
  Future<void>? checkTokenFuture;

  /* #region Lifecycle */
  @override
  void initState() {
    super.initState();

    // close keyboard when tap outside of text field
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    if (checkTokenFuture != null) {
      return;
    }

    checkTokenFuture = checkToken(context);
  }

  Future<void> checkToken(BuildContext context) async {
    AuthService auth = Dependencies.of(context).authService;
    AuthStateManager authStateManager =
        Dependencies.of(context).authStateManager;
    GoRouter router = GoRouter.of(context);
    GoRouterState routerState = GoRouterState.of(context);

    String redirect = routerState.uri.queryParameters['redirect'] ?? '/home';

    try {
      final token = await auth.check().timeout(const Duration(seconds: 5));
      if (token != null) {
        authStateManager.setAuthenticated();

        router.go(redirect);
      } else {
        authStateManager.setUnauthenticated();
        router.go('/login?redirect=$redirect');
      }
    } catch (e, stackTrace) {
      log(e.toString(), stackTrace: stackTrace);
      router.go('/login?redirect=$redirect');
    }
  }

  @override
  void didUpdateWidget(LoadingPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Widget configuration changed
  }

  @override
  void dispose() {
    // Permanent removal of a tree stent
    super.dispose();
  }
  /* #endregion */

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
} // _LoadingPageState
