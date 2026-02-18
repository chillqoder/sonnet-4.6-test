import 'package:flutter/material.dart';

class AppColors {
  static const background = Color(0xFF111219);
  static const surface = Color(0xFF15171A);
  static const card = Color(0xFF1C1E24);
  static const primaryText = Color(0xFFE6E7EB);
  static const secondaryText = Color(0xFFA6A8AD);
  static const accent = Color(0xFF2ECC71);
  static const error = Color(0xFFFF6B6B);
  static const like = Color(0xFF2ECC71);
  static const nope = Color(0xFFFF6B6B);
}

class AppTheme {
  static ThemeData get dark => ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.accent,
          secondary: AppColors.accent,
          surface: AppColors.surface,
          error: AppColors.error,
          onPrimary: Colors.black,
          onSecondary: Colors.black,
          onSurface: AppColors.primaryText,
          onError: Colors.white,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.surface,
          selectedItemColor: AppColors.accent,
          unselectedItemColor: AppColors.secondaryText,
          type: BottomNavigationBarType.fixed,
          elevation: 0,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.surface,
          foregroundColor: AppColors.primaryText,
          elevation: 0,
          centerTitle: true,
        ),
        cardTheme: const CardThemeData(
          color: AppColors.card,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          hintStyle: const TextStyle(color: AppColors.secondaryText),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.accent,
            foregroundColor: Colors.black,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
          ),
        ),
        chipTheme: ChipThemeData(
          backgroundColor: AppColors.surface,
          selectedColor: AppColors.accent.withOpacity(0.2),
          labelStyle: const TextStyle(color: AppColors.primaryText, fontSize: 13),
          side: const BorderSide(color: AppColors.surface),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        useMaterial3: true,
      );
}
