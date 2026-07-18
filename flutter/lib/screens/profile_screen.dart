import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../l10n/app_localizations.dart';
import '../providers/app_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_bottom_nav.dart';
import '../widgets/voice_fab.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final app = context.watch<AppProvider>();

    final List<Map<String, dynamic>> items = [
      {'icon': Icons.agriculture_rounded, 'label': l.profileMyFarms, 'route': '/my-farms', 'color': AppColors.primary},
      {'icon': Icons.bar_chart_rounded, 'label': l.profileExpenses, 'route': '/expenses', 'color': AppColors.accent},
      {'icon': Icons.account_balance_rounded, 'label': l.profileSchemes, 'route': '/schemes', 'color': AppColors.supporting},
      {'icon': Icons.forum_rounded, 'label': l.profileForum, 'route': '/forum', 'color': AppColors.secondary},
      {'icon': Icons.settings_rounded, 'label': l.profileSettings, 'route': '/settings', 'color': AppColors.textSecondary},
      {'icon': Icons.help_rounded, 'label': l.profileHelp, 'route': '/help', 'color': AppColors.highlight},
    ];

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Column(
                    children: [
                      // Profile header
                      Container(
                        padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
                        decoration:
                            const BoxDecoration(gradient: AppColors.heroGradient),
                        child: Column(
                          children: [
                            Container(
                              width: 88,
                              height: 88,
                              decoration: BoxDecoration(
                                color: Colors.white.withAlpha(30),
                                shape: BoxShape.circle,
                                border: Border.all(
                                    color: Colors.white.withAlpha(80), width: 3),
                              ),
                              child: const Center(
                                child: Text('👨‍🌾', style: TextStyle(fontSize: 44)),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              app.farmerName,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '+91 ${app.phone}',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                color: Colors.white.withAlpha(179),
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Stats row
                      Container(
                        margin: const EdgeInsets.all(16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _StatCell(value: '4', label: 'Farms'),
                            _Vdivider(),
                            _StatCell(value: '12', label: 'Crops'),
                            _Vdivider(),
                            _StatCell(value: '9.5', label: 'Acres'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (_, i) {
                        if (i == items.length) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                await context.read<AppProvider>().logout();
                                if (context.mounted) context.go('/language');
                              },
                              icon: const Icon(Icons.logout_rounded,
                                  color: AppColors.error),
                              label: Text(
                                l.profileLogout,
                                style: const TextStyle(color: AppColors.error),
                              ),
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppColors.error),
                              ),
                            ),
                          );
                        }
                        final item = items[i];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: _ProfileTile(
                            icon: item['icon'] as IconData,
                            label: item['label'] as String,
                            color: item['color'] as Color,
                            onTap: () => context.go(item['route'] as String),
                          ),
                        );
                      },
                      childCount: items.length + 1,
                    ),
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ),
            const VoiceFab(),
          ],
        ),
      ),
      bottomNavigationBar: const KrishiBottomNav(currentIndex: 4),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ProfileTile({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: color.withAlpha(26),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(label,
                    style: Theme.of(context).textTheme.titleSmall),
              ),
              const Icon(Icons.chevron_right_rounded,
                  color: AppColors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCell extends StatelessWidget {
  final String value;
  final String label;

  const _StatCell({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.primary,
            )),
        Text(label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              color: AppColors.textSecondary,
            )),
      ],
    );
  }
}

class _Vdivider extends StatelessWidget {
  const _Vdivider();

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 36, color: AppColors.divider);
  }
}
