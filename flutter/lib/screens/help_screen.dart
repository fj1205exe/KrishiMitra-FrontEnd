import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  int? _openFaq;

  static const List<Map<String, String>> _faqs = [
    {
      'q': 'How do I scan my crop for diseases?',
      'a': 'Go to Scan tab → Tap "Capture Photo" → Point camera at the leaf → Wait for AI to analyze.',
    },
    {
      'q': 'How do I change my language?',
      'a': 'Go to Profile → Settings → Language → Select your preferred language → Tap Continue.',
    },
    {
      'q': 'Are the market prices updated daily?',
      'a': 'Yes, mandi prices are updated every morning by 9 AM from official AGMARK data.',
    },
    {
      'q': 'How do I apply for government schemes?',
      'a': 'Go to Profile → Schemes → Find a scheme you are eligible for → Tap "Apply Now".',
    },
    {
      'q': 'Can I use the app without internet?',
      'a': 'Basic features like saved farm data and reports work offline. Market prices and AI chat require internet.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.helpTitle),
        leading: BackButton(onPressed: () => context.go('/profile')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Helpline card
          KrishiGradientCard(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(30),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.phone_rounded,
                      color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l.helpHelplineName,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        '1800-180-1551',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: Colors.white.withAlpha(230),
                          letterSpacing: 1,
                        ),
                      ),
                      Text(
                        l.helpFree,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          color: Colors.white.withAlpha(179),
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => launchUrl(Uri.parse('tel:1800-180-1551')),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.primaryDark,
                    minimumSize: const Size(72, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: Text(l.helpCall),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(l.helpFaq, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 12),
          ..._faqs.asMap().entries.map((e) {
            final i = e.key;
            final faq = e.value;
            final open = _openFaq == i;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _openFaq = open ? null : i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  decoration: BoxDecoration(
                    color: open ? AppColors.primarySurface : AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        color: open ? AppColors.primary : AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                faq['q']!,
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: open
                                      ? AppColors.primary
                                      : AppColors.textPrimary,
                                ),
                              ),
                            ),
                            Icon(
                              open
                                  ? Icons.keyboard_arrow_up_rounded
                                  : Icons.keyboard_arrow_down_rounded,
                              color: open
                                  ? AppColors.primary
                                  : AppColors.textSecondary,
                            ),
                          ],
                        ),
                      ),
                      if (open)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          child: Text(
                            faq['a']!,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14,
                              color: AppColors.textPrimary,
                              height: 1.5,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
