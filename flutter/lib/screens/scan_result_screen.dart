import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class ScanResultScreen extends StatelessWidget {
  final String? imagePath;
  const ScanResultScreen({super.key, this.imagePath});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.scanDisease),
        leading: BackButton(onPressed: () => context.go('/scan')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Mock leaf image
            Container(
              height: 220,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(
                child: Text('🍃', style: TextStyle(fontSize: 80)),
              ),
            ),
            const SizedBox(height: 20),
            // Result card
            KrishiCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.errorSurface,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Text(
                          l.scanDisease,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.error,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${l.scanConfidence}: 89%',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Wheat Rust (Yellow Rust)',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Puccinia striiformis — A fungal disease causing yellow-orange stripes on leaves. Spreads rapidly in cool and moist conditions.',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Treatment card
            KrishiCard(
              padding: const EdgeInsets.all(20),
              color: AppColors.primarySurface,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.local_pharmacy_rounded,
                          color: AppColors.primary, size: 22),
                      const SizedBox(width: 8),
                      Text(l.scanTreatment,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...[
                    'Apply Propiconazole 25% EC @ 0.1% spray',
                    'Spray early morning or evening for best results',
                    'Repeat after 10-12 days if infection persists',
                    'Remove and destroy severely infected leaves',
                  ].map((step) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.check_circle_rounded,
                                color: AppColors.primary, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                step,
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  color: AppColors.textPrimary,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.save_alt_rounded),
              label: Text(l.scanSaveReport),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () => context.go('/chat'),
              icon: const Icon(Icons.chat_bubble_rounded),
              label: Text(l.chatAskAssistant),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
