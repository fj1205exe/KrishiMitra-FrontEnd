import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';
import '../widgets/krishi_bottom_nav.dart';

class CropAdvisorScreen extends StatefulWidget {
  const CropAdvisorScreen({super.key});

  @override
  State<CropAdvisorScreen> createState() => _CropAdvisorScreenState();
}

class _CropAdvisorScreenState extends State<CropAdvisorScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  static const List<Map<String, dynamic>> _calendarItems = [
    {'month': 'June–July', 'crop': 'Rice / Kharif', 'action': 'Sowing season starts. Prepare fields, apply basal fertilizer.', 'emoji': '🌱'},
    {'month': 'August', 'crop': 'Rice / Kharif', 'action': 'Apply top dressing Urea. Monitor for blast and BPH.', 'emoji': '🌿'},
    {'month': 'October', 'crop': 'Rice / Kharif', 'action': 'Harvesting season. Ensure grain moisture < 20%.', 'emoji': '🌾'},
    {'month': 'Nov–Dec', 'crop': 'Wheat / Rabi', 'action': 'Sow wheat. Apply DAP @ 50 kg/acre as basal dose.', 'emoji': '🌱'},
    {'month': 'January', 'crop': 'Wheat / Rabi', 'action': 'First irrigation. Apply Urea @ 33 kg/acre.', 'emoji': '💧'},
    {'month': 'March–April', 'crop': 'Wheat / Rabi', 'action': 'Harvest when 90% grains are golden yellow.', 'emoji': '🌾'},
  ];

  static const List<Map<String, dynamic>> _recommendations = [
    {
      'crop': 'Soybean',
      'reason': 'High demand, suitable for your black soil, good monsoon expected',
      'profit': '₹12,000/acre',
      'risk': 'Low',
      'emoji': '🟡',
    },
    {
      'crop': 'Turmeric',
      'reason': 'Premium prices this season, grows well in your district',
      'profit': '₹18,000/acre',
      'risk': 'Medium',
      'emoji': '🟠',
    },
    {
      'crop': 'Onion',
      'reason': 'Short-duration cash crop, good market access nearby',
      'profit': '₹8,000/acre',
      'risk': 'Medium',
      'emoji': '🧅',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.cropsAdvisor),
        leading: BackButton(onPressed: () => context.go('/crops')),
        bottom: TabBar(
          controller: _tabs,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          labelStyle: const TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
          tabs: [
            Tab(text: l.cropsCalendar),
            Tab(text: l.cropsAdvisor),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: [
          // Calendar tab
          ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _calendarItems.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (_, i) {
              final item = _calendarItems[i];
              return KrishiCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.primarySurface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(item['emoji'] as String,
                            style: const TextStyle(fontSize: 20)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(item['month'] as String,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.primary,
                                  )),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primarySurface,
                                  borderRadius: BorderRadius.circular(100),
                                ),
                                child: Text(item['crop'] as String,
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.primaryDark,
                                    )),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(item['action'] as String,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                color: AppColors.textSecondary,
                                height: 1.4,
                              )),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          // Advisor tab
          ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _recommendations.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, i) {
              final rec = _recommendations[i];
              final risk = rec['risk'] as String;
              return KrishiCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(rec['emoji'] as String,
                            style: const TextStyle(fontSize: 32)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(rec['crop'] as String,
                              style: Theme.of(context).textTheme.headlineSmall),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: risk == 'Low'
                                ? AppColors.primarySurface
                                : AppColors.accentSurface,
                            borderRadius: BorderRadius.circular(100),
                          ),
                          child: Text(
                            '$risk Risk',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: risk == 'Low'
                                  ? AppColors.primary
                                  : AppColors.accent,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(rec['reason'] as String,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          color: AppColors.textSecondary,
                          height: 1.4,
                        )),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Icon(Icons.trending_up_rounded,
                            color: AppColors.success, size: 18),
                        const SizedBox(width: 6),
                        Text(
                          'Expected profit: ${rec['profit']}/acre',
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.success,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: const KrishiBottomNav(currentIndex: 1),
    );
  }
}
