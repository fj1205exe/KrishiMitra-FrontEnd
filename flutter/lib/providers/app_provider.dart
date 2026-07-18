import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppProvider extends ChangeNotifier {
  static const _onboardedKey = 'onboarded';
  static const _phoneKey = 'phone';
  static const _farmerNameKey = 'farmer_name';

  bool _onboarded = false;
  String _phone = '';
  String _farmerName = 'Farmer';
  bool _loaded = false;

  bool get onboarded => _onboarded;
  bool get loaded => _loaded;
  String get phone => _phone;
  String get farmerName => _farmerName;

  AppProvider() {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    _onboarded = prefs.getBool(_onboardedKey) ?? false;
    _phone = prefs.getString(_phoneKey) ?? '';
    _farmerName = prefs.getString(_farmerNameKey) ?? 'Farmer';
    _loaded = true;
    notifyListeners();
  }

  Future<void> completeOnboarding({required String phone, required String name}) async {
    _phone = phone;
    _farmerName = name;
    _onboarded = true;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardedKey, true);
    await prefs.setString(_phoneKey, phone);
    await prefs.setString(_farmerNameKey, name);
  }

  Future<void> logout() async {
    _onboarded = false;
    _phone = '';
    _farmerName = 'Farmer';
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
