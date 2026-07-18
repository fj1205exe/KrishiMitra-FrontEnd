import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // ── Backgrounds ──────────────────────────────────────────────────────────
  static const Color background = Color(0xFFF8F9F3);
  static const Color surface = Color(0xFFFFFFFF);

  // ── Brand greens ─────────────────────────────────────────────────────────
  static const Color primary = Color(0xFF6A994E);
  static const Color primaryDark = Color(0xFF606C38);
  static const Color secondary = Color(0xFFA7C957);
  static const Color supporting = Color(0xFFADC178);

  // ── Accents ───────────────────────────────────────────────────────────────
  static const Color accent = Color(0xFFDDA15E);
  static const Color highlight = Color(0xFFF6BD60);

  // ── Text ─────────────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF2E2E2E);
  static const Color textSecondary = Color(0xFF666666);

  // ── Borders / dividers ───────────────────────────────────────────────────
  static const Color border = Color(0xFFE5E7EB);
  static const Color divider = Color(0xFFECECEC);

  // ── Semantic ─────────────────────────────────────────────────────────────
  static const Color error = Color(0xFFD9534F);
  static const Color warning = Color(0xFFF6BD60);
  static const Color success = Color(0xFF6A994E);

  // ── Helpers ───────────────────────────────────────────────────────────────
  /// Soft green chip / tag background
  static const Color primarySurface = Color(0xFFEEF4E8);

  /// Soft amber background
  static const Color accentSurface = Color(0xFFFFF4E6);

  /// Soft red background
  static const Color errorSurface = Color(0xFFFEE8E8);

  /// Card shadow — layered for a soft, premium depth
  static const Color shadow = Color(0x14000000);
  static const Color shadowSoft = Color(0x0A000000);

  /// Soft green-tinted glow used under primary/elevated surfaces
  static const Color shadowGreen = Color(0x266A994E);

  /// Elevated button soft shadow list
  static List<BoxShadow> get cardShadow => const [
        BoxShadow(color: shadowSoft, blurRadius: 4, offset: Offset(0, 1)),
        BoxShadow(color: shadow, blurRadius: 16, offset: Offset(0, 6)),
      ];

  /// Gradient — green hero headers
  static LinearGradient get primaryGradient => const LinearGradient(
        colors: [primary, primaryDark],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );

  static LinearGradient get heroGradient => const LinearGradient(
        colors: [Color(0xFF7DB560), primary, primaryDark],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      );
}
