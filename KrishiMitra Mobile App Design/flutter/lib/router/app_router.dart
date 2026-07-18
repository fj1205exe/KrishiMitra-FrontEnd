import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/app_provider.dart';
import '../screens/splash_screen.dart';
import '../screens/language_screen.dart';
import '../screens/login_screen.dart';
import '../screens/otp_screen.dart';
import '../screens/farm_setup_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/crops_screen.dart';
import '../screens/crop_advisor_screen.dart';
import '../screens/market_screen.dart';
import '../screens/scan_screen.dart';
import '../screens/scan_result_screen.dart';
import '../screens/chat_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/help_screen.dart';
import '../screens/schemes_screen.dart';
import '../screens/expenses_screen.dart';
import '../screens/forum_screen.dart';
import '../screens/my_farms_screen.dart';

GoRouter buildRouter(AppProvider appProvider) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      if (!appProvider.loaded) return '/splash';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/language', builder: (_, __) => const LanguageScreen()),
      GoRoute(
        path: '/login',
        builder: (_, state) =>
            LoginScreen(phone: state.uri.queryParameters['phone'] ?? ''),
      ),
      GoRoute(
        path: '/otp',
        builder: (_, state) =>
            OtpScreen(phone: state.uri.queryParameters['phone'] ?? ''),
      ),
      GoRoute(
        path: '/farm-setup',
        builder: (_, state) =>
            FarmSetupScreen(phone: state.uri.queryParameters['phone'] ?? ''),
      ),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
      GoRoute(path: '/crops', builder: (_, __) => const CropsScreen()),
      GoRoute(path: '/crop-advisor', builder: (_, __) => const CropAdvisorScreen()),
      GoRoute(path: '/market', builder: (_, __) => const MarketScreen()),
      GoRoute(path: '/scan', builder: (_, __) => const ScanScreen()),
      GoRoute(
        path: '/scan-result',
        builder: (_, state) => ScanResultScreen(
          imagePath: state.uri.queryParameters['path'],
        ),
      ),
      GoRoute(path: '/chat', builder: (_, __) => const ChatScreen()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
      GoRoute(path: '/help', builder: (_, __) => const HelpScreen()),
      GoRoute(path: '/schemes', builder: (_, __) => const SchemesScreen()),
      GoRoute(path: '/expenses', builder: (_, __) => const ExpensesScreen()),
      GoRoute(path: '/forum', builder: (_, __) => const ForumScreen()),
      GoRoute(path: '/my-farms', builder: (_, __) => const MyFarmsScreen()),
    ],
  );
}
