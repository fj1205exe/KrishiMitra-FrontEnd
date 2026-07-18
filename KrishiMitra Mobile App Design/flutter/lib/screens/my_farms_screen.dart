import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class MyFarmsScreen extends StatelessWidget {
  const MyFarmsScreen({super.key});

  static const List<Map<String, dynamic>> _farms = [
    {
      'name': 'Main Farm',
      'area': '4 acres',
      'location': 'Pune, Maharashtra',
      'crops': 'Wheat, Soybean',
      'soil': 'Black Soil',
      'emoji': '🌾',
    },
    {
      'name': 'River Field',
      'area': '3 acres',
      'location': 'Nashik, Maharashtra',
      'crops': 'Rice, Vegetables',
      'soil': 'Alluvial Soil',
      'emoji': '🌱',
    },
    {
      'name': 'Dry Land',
      'area': '2.5 acres',
      'location': 'Solapur, Maharashtra',
      'crops': 'Cotton, Pulses',
      'soil': 'Red Soil',
      'emoji': '🌿',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.profileMyFarms),
        leading: BackButton(onPressed: () => context.go('/profile')),
        actions: [
          IconButton(icon: const Icon(Icons.add_rounded), onPressed: () {}),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _farms.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final farm = _farms[i];
          return KrishiCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Center(
                        child: Text(farm['emoji'] as String,
                            style: const TextStyle(fontSize: 24)),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(farm['name'] as String,
                              style: Theme.of(context).textTheme.titleMedium),
                          Text(
                            '${farm['area']} · ${farm['location']}',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_rounded,
                          color: AppColors.textSecondary, size: 20),
                      onPressed: () {},
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Divider(color: AppColors.divider, height: 1),
                const SizedBox(height: 14),
                _Row('🌱 Crops', farm['crops'] as String),
                const SizedBox(height: 6),
                _Row('🪨 Soil', farm['soil'] as String),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;

  const _Row(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              color: AppColors.textSecondary,
            )),
        const SizedBox(width: 8),
        Text(value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            )),
      ],
    );
  }
}
