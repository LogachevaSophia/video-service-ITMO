import 'dart:io';

import 'package:echo/analytics/logging_repository.dart';

abstract class IAnalyticsRepository {
  Future<void> logPageOpen(String pageName, Map<String, dynamic> parameters);
  Future<void> logPageClose(String pageName, Map<String, dynamic> parameters);
  Future<void> logEvent(String eventName, Map<String, Object>? parameters);
}

class AnalyticsRepository implements IAnalyticsRepository {
  // Initialize singleton
  static final AnalyticsRepository instance = AnalyticsRepository(
    loggingRepository: (Platform.isAndroid || Platform.isIOS)
        ? AppMetricaLoggingRepository()
        : LocalLoggingRepository(),
  );

  final ILoggingRepository _loggingRepository;

  AnalyticsRepository({required ILoggingRepository loggingRepository})
      : _loggingRepository = loggingRepository;

  @override
  Future<void> logPageOpen(
    String pageName,
    Map<String, dynamic> parameters,
  ) async {
    await _loggingRepository.logEvent(
      'page/open',
      {
        'page': _makePageInfo(pageName, parameters),
      },
    );
  }

  @override
  Future<void> logPageClose(
    String pageName,
    Map<String, dynamic> parameters,
  ) async {
    await _loggingRepository.logEvent(
      'page/close',
      {
        'page': _makePageInfo(pageName, parameters),
      },
    );
  }

  Map<String, dynamic> _makePageInfo(
    String pageName,
    Map<String, dynamic>? parameters,
  ) {
    return {
      'page': {
        'name': pageName,
        'parameters': parameters,
      },
    };
  }

  @override
  Future<void> logEvent(
      String eventName, Map<String, Object>? parameters) async {
    return _loggingRepository.logEvent(
      eventName,
      parameters,
    );
  }
}
