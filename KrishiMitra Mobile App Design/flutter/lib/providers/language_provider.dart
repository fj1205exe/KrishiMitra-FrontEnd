import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageInfo {
  final String code;
  final String nativeName;
  final String englishName;
  final String flag;

  const LanguageInfo({
    required this.code,
    required this.nativeName,
    required this.englishName,
    required this.flag,
  });
}

const List<LanguageInfo> kLanguages = [
  LanguageInfo(code: 'en', nativeName: 'English', englishName: 'English', flag: '🇬🇧'),
  LanguageInfo(code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi', flag: '🇮🇳'),
  LanguageInfo(code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', flag: '🇮🇳'),
  LanguageInfo(code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳'),
  LanguageInfo(code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', flag: '🇮🇳'),
  LanguageInfo(code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', flag: '🇮🇳'),
  LanguageInfo(code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', flag: '🇮🇳'),
  LanguageInfo(code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', flag: '🇮🇳'),
  LanguageInfo(code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', flag: '🇮🇳'),
  LanguageInfo(code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', flag: '🇮🇳'),
];

class LanguageProvider extends ChangeNotifier {
  static const _prefKey = 'selected_language';

  Locale _locale = const Locale('hi'); // default Hindi for farmers

  Locale get locale => _locale;

  String get currentCode => _locale.languageCode;

  LanguageInfo get currentLanguage =>
      kLanguages.firstWhere((l) => l.code == _locale.languageCode,
          orElse: () => kLanguages[1]);

  LanguageProvider() {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);
    if (saved != null) {
      _locale = Locale(saved);
      notifyListeners();
    }
  }

  Future<void> setLanguage(String code) async {
    _locale = Locale(code);
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, code);
  }
}
