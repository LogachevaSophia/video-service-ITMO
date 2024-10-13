import 'package:flutter/material.dart';

class AuthState {
  final bool isAuthenticated;

  AuthState({
    required this.isAuthenticated,
  });
}

class AuthStateManager extends ValueNotifier<AuthState> {
  AuthStateManager(AuthState value) : super(value);

  void setAuthenticated() {
    value = AuthState(
      isAuthenticated: true,
    );
  }

  void setUnauthenticated() {
    value = AuthState(
      isAuthenticated: false,
    );
  }
}
