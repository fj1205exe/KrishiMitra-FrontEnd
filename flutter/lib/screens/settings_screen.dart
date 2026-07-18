import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../l10n/app_localizations.dart';
import '../providers/language_provider.dart';
import '../theme/app_colors.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final langProvider = context.watch<LanguageProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(l.settingsTitle),
        leading: BackButton(onPressed: () => context.go('/profile')),
      ),
      body: ListView(
        children: [
          // Language
          _SettingsTile(
            icon: Icons.language_rounded,
            label: l.settingsLanguage,
            value: langProvider.currentLanguage.nativeName,
            color: AppColors.primary,
            onTap: () => _showLanguagePicker(context, langProvider, l),
          ),
          const Divider(height: 1, color: AppColors.divider, indent: 70),
          // Notifications
          _SettingsTile(
            icon: Icons.notifications_rounded,
            label: l.settingsNotif,
            color: AppColors.accent,
            trailing: Switch(
              value: true,
              onChanged: (_) {},
              activeColor: AppColors.primary,
            ),
          ),
          const Divider(height: 1, color: AppColors.divider, indent: 70),
          _SettingsTile(
            icon: Icons.straighten_rounded,
            label: l.settingsUnits,
            value: l.settingsUnitsValue,
            color: AppColors.supporting,
            onTap: () {},
          ),
          const Divider(height: 1, color: AppColors.divider, indent: 70),
          _SettingsTile(
            icon: Icons.info_rounded,
            label: l.settingsAbout,
            value: 'v1.0.0',
            color: AppColors.textSecondary,
            onTap: () {},
          ),
          const Divider(height: 1, color: AppColors.divider, indent: 70),
          _SettingsTile(
            icon: Icons.privacy_tip_rounded,
            label: l.settingsPrivacy,
            color: AppColors.highlight,
            onTap: () {},
          ),
        ],
      ),
    );
  }

  void _showLanguagePicker(
      BuildContext context, LanguageProvider langProvider, AppLocalizations l) {
    String selected = langProvider.currentCode;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setState) => Container(
          height: MediaQuery.of(ctx).size.height * 0.75,
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(28),
          ),
          child: Column(
            children: [
              const SizedBox(height: 8),
              Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(
                      color: AppColors.border,
                      borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(l.settingsLanguage,
                    style: Theme.of(ctx).textTheme.headlineSmall),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 2.4,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                  ),
                  itemCount: kLanguages.length,
                  itemBuilder: (_, i) {
                    final lang = kLanguages[i];
                    final active = selected == lang.code;
                    return GestureDetector(
                      onTap: () => setState(() => selected = lang.code),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        decoration: BoxDecoration(
                          color: active
                              ? AppColors.primarySurface
                              : AppColors.background,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color:
                                active ? AppColors.primary : AppColors.border,
                            width: active ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 12),
                            Text(lang.flag,
                                style: const TextStyle(fontSize: 20)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                lang.nativeName,
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: active
                                      ? AppColors.primary
                                      : AppColors.textPrimary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: ElevatedButton(
                  onPressed: () async {
                    await context.read<LanguageProvider>().setLanguage(selected);
                    if (context.mounted) Navigator.pop(context);
                  },
                  child: Text(l.continueBtn),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? value;
  final Color color;
  final VoidCallback? onTap;
  final Widget? trailing;

  const _SettingsTile({
    required this.icon,
    required this.label,
    required this.color,
    this.value,
    this.onTap,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: color.withAlpha(26),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(label),
      subtitle: value != null ? Text(value!) : null,
      trailing: trailing ??
          (onTap != null
              ? const Icon(Icons.chevron_right_rounded,
                  color: AppColors.textSecondary)
              : null),
    );
  }
}
