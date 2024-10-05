class AppState<T> {
  final AppStateStatus status;
  final T data;

  const AppState({
    required this.data,
    required this.status,
  });

  AppState<T> copyWith({
    T? data,
    AppStateStatus? status,
  }) {
    return AppState(
      data: data ?? this.data,
      status: status ?? this.status,
    );
  }
}

enum AppStateStatus {
  initial,
  loading,
  loaded,
  error,
}
