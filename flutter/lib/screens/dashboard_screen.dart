import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../l10n/app_localizations.dart';
import '../providers/app_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_bottom_nav.dart';
import '../widgets/krishi_card.dart';
import '../widgets/voice_fab.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final app = context.watch<AppProvider>();

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                // Hero header
                SliverToBoxAdapter(child: _Header(l: l, farmerName: app.farmerName)),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Alert banner
                      _AlertBanner(l: l),
                      const SizedBox(height: 20),
                      // Weather card
                      _WeatherCard(l: l),
                      const SizedBox(height: 20),
                      // Quick actions
                      _SectionTitle(l.dashQuickActions),
                      const SizedBox(height: 12),
                      _QuickActions(l: l),
                      const SizedBox(height: 20),
                      // My crops
                      _SectionTitle(l.dashMyCrops),
                      const SizedBox(height: 12),
                      _CropsRow(l: l),
                      const SizedBox(height: 20),
                      // Market prices
                      _SectionTitle(l.dashMarket),
                      const SizedBox(height: 12),
                      _MarketPrices(l: l),
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

class _Header extends StatelessWidget {
  final AppLocalizations l;
  final String farmerName;

  const _Header({required this.l, required this.farmerName});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      decoration: const BoxDecoration(gradient: AppColors.heroGradient),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${l.dashGreeting}, $farmerName 👋',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'KrishiMitra · ${l.appTagline}',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    color: Colors.white.withAlpha(204),
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withAlpha(30),
              shape: BoxShape.circle,
              border:
                  Border.all(color: Colors.white.withAlpha(60), width: 2),
            ),
            child: const Center(
              child: Text('👨‍🌾', style: TextStyle(fontSize: 22)),
            ),
          ),
        ],
      ),
    );
  }
}

class _AlertBanner extends StatelessWidget {
  final AppLocalizations l;

  const _AlertBanner({required this.l});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.accentSurface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.accent.withAlpha(102)),
      ),
      child: Row(
        children: [
          const Text('⚠️', style: TextStyle(fontSize: 20)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              l.dashAlert,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WeatherCard extends StatelessWidget {
  final AppLocalizations l;
  const _WeatherCard({required this.l});

  @override
  Widget build(BuildContext context) {
    return KrishiCard(
      padding: const EdgeInsets.all(18),
      child: Row(
        children: [
          const Text('☀️', style: TextStyle(fontSize: 48)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(l.dashWeather,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w500,
                    )),
                Text('32${l.dashTemp} · ${l.weatherClear}',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    )),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              _WeatherStat(label: l.dashHumidity, value: '68%'),
              const SizedBox(height: 6),
              _WeatherStat(label: l.dashRain, value: '10%'),
            ],
          ),
        ],
      ),
    );
  }
}

class _WeatherStat extends StatelessWidget {
  final String label;
  final String value;
  const _WeatherStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 11,
                color: AppColors.textSecondary,
                fontFamily: 'Inter')),
        Text(value,
            style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
                fontFamily: 'Inter')),
      ],
    );
  }
}

class _QuickActions extends StatelessWidget {
  final AppLocalizations l;
  const _QuickActions({required this.l});

  @override
  Widget build(BuildContext context) {
    final actions = [
      {'icon': Icons.store_rounded, 'label': l.dashMarket, 'route': '/market', 'color': AppColors.primary},
      {'icon': Icons.camera_alt_rounded, 'label': l.dashDisease, 'route': '/scan', 'color': AppColors.accent},
      {'icon': Icons.account_balance_rounded, 'label': l.dashSchemes, 'route': '/schemes', 'color': AppColors.supporting},
      {'icon': Icons.bar_chart_rounded, 'label': l.dashExpenses, 'route': '/expenses', 'color': AppColors.highlight},
      {'icon': Icons.forum_rounded, 'label': l.dashForum, 'route': '/forum', 'color': AppColors.secondary},
      {'icon': Icons.calendar_month_rounded, 'label': l.dashCalendar, 'route': '/crop-advisor', 'color': AppColors.primaryDark},
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: actions.map((a) {
        final color = a['color'] as Color;
        return QuickActionTile(
          icon: a['icon'] as IconData,
          label: a['label'] as String,
          iconColor: color,
          bgColor: color.withAlpha(26),
          onTap: () => context.go(a['route'] as String),
        );
      }).toList(),
    );
  }
}

class _CropsRow extends StatelessWidget {
  final AppLocalizations l;
  const _CropsRow({required this.l});

  static const List<Map<String, dynamic>> _crops = [
    {'name': 'Wheat', 'emoji': '🌾', 'status': 'good', 'days': 45},
    {'name': 'Rice', 'emoji': '🌱', 'status': 'warning', 'days': 12},
    {'name': 'Cotton', 'emoji': '🌿', 'status': 'good', 'days': 78},
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 130,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _crops.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (_, i) {
          final crop = _crops[i];
          final isGood = crop['status'] == 'good';
          return GestureDetector(
            onTap: () => context.go('/crops'),
            child: Container(
              width: 120,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(crop['emoji'] as String,
                      style: const TextStyle(fontSize: 28)),
                  const Spacer(),
                  Text(
                    crop['name'] as String,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isGood
                          ? AppColors.primarySurface
                          : AppColors.accentSurface,
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: Text(
                      isGood ? l.cropsGood : l.cropsWarning,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: isGood ? AppColors.primary : AppColors.accent,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _MarketPrices extends StatelessWidget {
  final AppLocalizations l;
  const _MarketPrices({required this.l});

  static const List<Map<String, dynamic>> _prices = [
    {'name': 'Wheat', 'emoji': '🌾', 'price': '₹2,240', 'change': '+2.3%', 'up': true},
    {'name': 'Rice', 'emoji': '🌱', 'price': '₹3,100', 'change': '-0.8%', 'up': false},
    {'name': 'Soybean', 'emoji': '🟡', 'price': '₹4,200', 'change': '+1.1%', 'up': true},
  ];

  @override
  Widget build(BuildContext context) {
    return KrishiCard(
      padding: const EdgeInsets.all(0),
      child: Column(
        children: [
          ..._prices.asMap().entries.map((e) {
            final i = e.key;
            final p = e.value;
            return Column(
              children: [
                if (i > 0)
                  const Divider(height: 1, color: AppColors.divider),
                ListTile(
                  leading: Text(p['emoji'] as String,
                      style: const TextStyle(fontSize: 28)),
                  title: Text(p['name'] as String),
                  subtitle: Text(l.marketPerQtl),
                  trailing: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        p['price'] as String,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        p['change'] as String,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: (p['up'] as bool)
                              ? AppColors.success
                              : AppColors.error,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          }),
          const Divider(height: 1, color: AppColors.divider),
          TextButton(
            onPressed: () => context.go('/market'),
            child: Text(l.viewAll),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(text, style: Theme.of(context).textTheme.titleLarge);
  }
}
