import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'l10n/app_localizations.dart';
import 'providers/language_provider.dart';
import 'providers/app_provider.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const KrishiMitraApp(),
    ),
  );
}

class KrishiMitraApp extends StatefulWidget {
  const KrishiMitraApp({super.key});

  @override
  State<KrishiMitraApp> createState() => _KrishiMitraAppState();
}

class _KrishiMitraAppState extends State<KrishiMitraApp> {
  @override
  Widget build(BuildContext context) {
    final langProvider = context.watch<LanguageProvider>();
    final appProvider = context.watch<AppProvider>();

    final router = buildRouter(appProvider);

    return MaterialApp.router(
      title: 'KrishiMitra',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: router,

      // Localizations
      locale: langProvider.locale,
      supportedLocales: kSupportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}
