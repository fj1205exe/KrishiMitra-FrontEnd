import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class ForumScreen extends StatelessWidget {
  const ForumScreen({super.key});

  static const List<Map<String, dynamic>> _posts = [
    {
      'user': 'Ramesh Kumar',
      'emoji': '👨‍🌾',
      'time': '2 hours ago',
      'q': 'My wheat leaves are turning yellow. What should I do?',
      'replies': 8,
      'likes': 14,
      'tag': 'Disease',
    },
    {
      'user': 'Priya Devi',
      'emoji': '👩‍🌾',
      'time': '5 hours ago',
      'q': 'Best variety of rice for Maharashtra this season?',
      'replies': 12,
      'likes': 21,
      'tag': 'Varieties',
    },
    {
      'user': 'Suresh Patel',
      'emoji': '🧑‍🌾',
      'time': 'Yesterday',
      'q': 'How to reduce water usage in drip irrigation?',
      'replies': 5,
      'likes': 9,
      'tag': 'Irrigation',
    },
    {
      'user': 'Anita Singh',
      'emoji': '👩',
      'time': '2 days ago',
      'q': 'Is PM Fasal Bima applicable for pulses? How to apply?',
      'replies': 3,
      'likes': 7,
      'tag': 'Schemes',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l.forumTitle),
        leading: BackButton(onPressed: () => context.go('/profile')),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _posts.length + 1,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (_, i) {
          if (i == 0) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.edit_rounded),
                label: Text(l.forumAsk),
              ),
            );
          }
          final post = _posts[i - 1];
          return KrishiCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(post['emoji'] as String,
                        style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(post['user'] as String,
                              style:
                                  const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              )),
                          Text(post['time'] as String,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              )),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primarySurface,
                        borderRadius: BorderRadius.circular(100),
                      ),
                      child: Text(
                        post['tag'] as String,
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
                const SizedBox(height: 10),
                Text(
                  post['q'] as String,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _Stat(
                        icon: Icons.chat_bubble_outline_rounded,
                        value: '${post['replies']} ${l.forumReplies}'),
                    const SizedBox(width: 16),
                    _Stat(
                        icon: Icons.favorite_border_rounded,
                        value: '${post['likes']} ${l.forumLikes}'),
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

class _Stat extends StatelessWidget {
  final IconData icon;
  final String value;

  const _Stat({required this.icon, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textSecondary),
        const SizedBox(width: 4),
        Text(value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            )),
      ],
    );
  }
}
