import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class SchemesScreen extends StatelessWidget {
  const SchemesScreen({super.key});

  static const List<Map<String, dynamic>> _schemes = [
    {
      'name': 'PM Kisan Samman Nidhi',
      'desc': '₹6,000/year direct benefit transfer to farmer families',
      'emoji': '💰',
      'tag': 'Financial Aid',
      'eligible': true,
    },
    {
      'name': 'PM Fasal Bima Yojana',
      'desc': 'Crop insurance at very low premium with full coverage',
      'emoji': '🛡️',
      'tag': 'Insurance',
      'eligible': true,
    },
    {
      'name': 'Kisan Credit Card',
      'desc': 'Collateral-free credit for farmers up to ₹3 lakh at 4% interest',
      'emoji': '💳',
      'tag': 'Credit',
      'eligible': false,
    },
    {
      'name': 'Soil Health Card Scheme',
      'desc': 'Free soil testing and nutrient-specific fertilizer recommendations',
      'emoji': '🧪',
      'tag': 'Testing',
      'eligible': true,
    },
    {
      'name': 'PM Krishi Sinchayee Yojana',
      'desc': 'Subsidy on drip & sprinkler irrigation installation',
      'emoji': '💧',
      'tag': 'Irrigation',
      'eligible': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.schemesTitle),
        leading: BackButton(onPressed: () => context.go('/profile')),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _schemes.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final s = _schemes[i];
          final eligible = s['eligible'] as bool;
          return KrishiCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(s['emoji'] as String,
                        style: const TextStyle(fontSize: 32)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s['name'] as String,
                              style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primarySurface,
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Text(
                              s['tag'] as String,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(s['desc'] as String,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    )),
                const SizedBox(height: 14),
                Row(
                  children: [
                    if (eligible)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded,
                                color: AppColors.primary, size: 14),
                            const SizedBox(width: 4),
                            Text(l.schemesEligible,
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primary,
                                )),
                          ],
                        ),
                      ),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: eligible ? () {} : null,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(100, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        textStyle: const TextStyle(
                            fontFamily: 'Inter', fontSize: 13),
                      ),
                      child: Text(l.schemesApply),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
