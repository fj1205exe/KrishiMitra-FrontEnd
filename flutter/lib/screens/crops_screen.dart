import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_bottom_nav.dart';
import '../widgets/krishi_card.dart';
import '../widgets/voice_fab.dart';

class CropsScreen extends StatelessWidget {
  const CropsScreen({super.key});

  static const List<Map<String, dynamic>> _crops = [
    {'name': 'Wheat', 'emoji': '🌾', 'status': 'good', 'area': '4 acres', 'harvest': '45 days'},
    {'name': 'Rice', 'emoji': '🌱', 'status': 'warning', 'area': '2 acres', 'harvest': '12 days'},
    {'name': 'Cotton', 'emoji': '🌿', 'status': 'good', 'area': '3 acres', 'harvest': '78 days'},
    {'name': 'Sugarcane', 'emoji': '🎋', 'status': 'good', 'area': '1.5 acres', 'harvest': '120 days'},
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                SliverAppBar(
                  floating: true,
                  title: Text(l.cropsTitle),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.add_rounded),
                      onPressed: () {},
                    ),
                  ],
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Quick action row
                      Row(
                        children: [
                          Expanded(
                            child: _ActionCard(
                              icon: Icons.psychology_rounded,
                              label: l.cropsAdvisor,
                              color: AppColors.primary,
                              onTap: () => context.go('/crop-advisor'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: _ActionCard(
                              icon: Icons.calendar_month_rounded,
                              label: l.cropsCalendar,
                              color: AppColors.accent,
                              onTap: () => context.go('/crop-advisor'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Text(l.cropsTitle,
                          style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 12),
                      ..._crops.map((crop) => Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: _CropCard(crop: crop, l: l),
                          )),
                      const SizedBox(height: 80),
                    ]),
                  ),
                ),
              ],
            ),
            const VoiceFab(),
          ],
        ),
      ),
      bottomNavigationBar: const KrishiBottomNav(currentIndex: 1),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color, color.withAlpha(204)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
                color: color.withAlpha(51),
                blurRadius: 12,
                offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white, size: 24),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CropCard extends StatelessWidget {
  final Map<String, dynamic> crop;
  final AppLocalizations l;

  const _CropCard({required this.crop, required this.l});

  @override
  Widget build(BuildContext context) {
    final status = crop['status'] as String;
    final isGood = status == 'good';

    return KrishiCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: isGood ? AppColors.primarySurface : AppColors.accentSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Text(crop['emoji'] as String,
                  style: const TextStyle(fontSize: 28)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(crop['name'] as String,
                    style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 4),
                Text(
                  '${crop['area']} · ${l.cropsHarvestIn} ${crop['harvest']}',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Column(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isGood ? AppColors.primarySurface : AppColors.accentSurface,
                  borderRadius: BorderRadius.circular(100),
                ),
                child: Text(
                  isGood ? l.cropsGood : l.cropsWarning,
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isGood ? AppColors.primary : AppColors.accent,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
