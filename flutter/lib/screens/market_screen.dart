import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_bottom_nav.dart';
import '../widgets/krishi_card.dart';
import '../widgets/voice_fab.dart';

class MarketScreen extends StatelessWidget {
  const MarketScreen({super.key});

  static const List<Map<String, dynamic>> _prices = [
    {'name': 'Wheat', 'emoji': '🌾', 'price': 2240, 'change': 2.3, 'unit': 'quintal'},
    {'name': 'Rice', 'emoji': '🌱', 'price': 3100, 'change': -0.8, 'unit': 'quintal'},
    {'name': 'Soybean', 'emoji': '🟡', 'price': 4200, 'change': 1.1, 'unit': 'quintal'},
    {'name': 'Cotton', 'emoji': '🌿', 'price': 6800, 'change': -1.5, 'unit': 'quintal'},
    {'name': 'Mustard', 'emoji': '💛', 'price': 5400, 'change': 3.2, 'unit': 'quintal'},
    {'name': 'Sugarcane', 'emoji': '🎋', 'price': 350, 'change': 0.0, 'unit': 'quintal'},
    {'name': 'Tomato', 'emoji': '🍅', 'price': 40, 'change': -12.4, 'unit': 'kg'},
    {'name': 'Onion', 'emoji': '🧅', 'price': 28, 'change': 5.8, 'unit': 'kg'},
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
                  title: Text(l.marketTitle),
                  leading: BackButton(onPressed: () => context.go('/dashboard')),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Last updated
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time_rounded,
                                size: 14, color: AppColors.primary),
                            const SizedBox(width: 6),
                            Text(
                              '${l.marketLastUpdated}: Today 9:00 AM',
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      KrishiCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: _prices.asMap().entries.map((e) {
                            final i = e.key;
                            final p = e.value;
                            final up = (p['change'] as double) >= 0;
                            return Column(
                              children: [
                                if (i > 0)
                                  const Divider(height: 1, color: AppColors.divider),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 14),
                                  child: Row(
                                    children: [
                                      Text(p['emoji'] as String,
                                          style: const TextStyle(fontSize: 28)),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(p['name'] as String,
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .titleSmall),
                                            Text(
                                                '${l.marketPerQtl} (${p['unit']})',
                                                style: const TextStyle(
                                                  fontFamily: 'Inter',
                                                  fontSize: 11,
                                                  color: AppColors.textSecondary,
                                                )),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            '₹${p['price']}',
                                            style: const TextStyle(
                                              fontFamily: 'Inter',
                                              fontSize: 18,
                                              fontWeight: FontWeight.w800,
                                              color: AppColors.textPrimary,
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              Icon(
                                                up
                                                    ? Icons.arrow_upward_rounded
                                                    : Icons.arrow_downward_rounded,
                                                size: 12,
                                                color: up
                                                    ? AppColors.success
                                                    : AppColors.error,
                                              ),
                                              Text(
                                                '${(p['change'] as double).abs()}%',
                                                style: TextStyle(
                                                  fontFamily: 'Inter',
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w600,
                                                  color: up
                                                      ? AppColors.success
                                                      : AppColors.error,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 100),
                    ]),
                  ),
                ),
              ],
            ),
            const VoiceFab(),
          ],
        ),
      ),
      bottomNavigationBar: const KrishiBottomNav(currentIndex: 0),
    );
  }
}
