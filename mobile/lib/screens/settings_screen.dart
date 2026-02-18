import 'package:flutter/material.dart';
import '../theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Настройки')),
      body: ListView(
        children: [
          const _SectionHeader('Интерфейс'),
          _SettingsTile(
            icon: Icons.dark_mode_rounded,
            title: 'Тёмная тема',
            subtitle: 'Включена по умолчанию',
            trailing: Switch(
              value: true,
              onChanged: null,
              activeThumbColor: AppColors.accent,
            ),
          ),
          _SettingsTile(
            icon: Icons.language_rounded,
            title: 'Язык интерфейса',
            subtitle: 'Русский',
            onTap: () {},
          ),
          const _SectionHeader('О приложении'),
          _SettingsTile(
            icon: Icons.movie_filter_rounded,
            title: 'MovieSwipe',
            subtitle: 'Версия 1.0.0',
          ),
          _SettingsTile(
            icon: Icons.info_outline_rounded,
            title: 'Источник данных',
            subtitle: 'The Movie Database (TMDB)',
          ),
          _SettingsTile(
            icon: Icons.storage_rounded,
            title: 'Хранение данных',
            subtitle: 'Офлайн — данные сохраняются на устройстве',
          ),
          const SizedBox(height: 32),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              '© 2025 MovieSwipe. Все права защищены.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: AppColors.secondaryText, fontSize: 12),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.title);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: AppColors.accent,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppColors.accent, size: 20),
      ),
      title: Text(title,
          style: const TextStyle(color: AppColors.primaryText, fontSize: 15)),
      subtitle: subtitle != null
          ? Text(subtitle!,
              style:
                  const TextStyle(color: AppColors.secondaryText, fontSize: 12))
          : null,
      trailing: trailing ??
          (onTap != null
              ? const Icon(Icons.chevron_right_rounded,
                  color: AppColors.secondaryText)
              : null),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}
