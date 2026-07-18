import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_card.dart';

class ExpensesScreen extends StatelessWidget {
  const ExpensesScreen({super.key});

  static const List<Map<String, dynamic>> _entries = [
    {'label': 'Fertilizer - Urea', 'amount': 1800, 'type': 'expense', 'date': 'Jul 12', 'emoji': '🧪'},
    {'label': 'Wheat Sale', 'amount': 22400, 'type': 'income', 'date': 'Jul 10', 'emoji': '🌾'},
    {'label': 'Pesticide Spray', 'amount': 600, 'type': 'expense', 'date': 'Jul 8', 'emoji': '💧'},
    {'label': 'Labour - Harvesting', 'amount': 3200, 'type': 'expense', 'date': 'Jul 5', 'emoji': '👨‍🌾'},
    {'label': 'Rice Sale', 'amount': 18600, 'type': 'income', 'date': 'Jul 2', 'emoji': '🌱'},
    {'label': 'Seeds - Wheat', 'amount': 2400, 'type': 'expense', 'date': 'Jun 28', 'emoji': '🌰'},
  ];

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    final income = _entries
        .where((e) => e['type'] == 'income')
        .fold(0, (s, e) => s + (e['amount'] as int));
    final expense = _entries
        .where((e) => e['type'] == 'expense')
        .fold(0, (s, e) => s + (e['amount'] as int));
    final profit = income - expense;

    return Scaffold(
      appBar: AppBar(
        title: Text(l.expensesTitle),
        leading: BackButton(onPressed: () => context.go('/profile')),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Summary row
          Row(
            children: [
              Expanded(
                child: _SumCard(
                  label: l.expensesIncome,
                  value: '₹${income ~/ 1000}K',
                  color: AppColors.success,
                  bgColor: AppColors.primarySurface,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _SumCard(
                  label: l.expensesCost,
                  value: '₹${expense ~/ 1000}K',
                  color: AppColors.error,
                  bgColor: AppColors.errorSurface,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _SumCard(
                  label: l.expensesProfit,
                  value: '₹${profit ~/ 1000}K',
                  color: AppColors.primary,
                  bgColor: AppColors.primarySurface,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(l.expensesRecent,
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          KrishiCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: _entries.asMap().entries.map((e) {
                final i = e.key;
                final entry = e.value;
                final isIncome = entry['type'] == 'income';
                return Column(
                  children: [
                    if (i > 0)
                      const Divider(height: 1, color: AppColors.divider),
                    ListTile(
                      leading: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: isIncome
                              ? AppColors.primarySurface
                              : AppColors.errorSurface,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(entry['emoji'] as String,
                              style: const TextStyle(fontSize: 20)),
                        ),
                      ),
                      title: Text(entry['label'] as String),
                      subtitle: Text(entry['date'] as String),
                      trailing: Text(
                        '${isIncome ? '+' : '-'}₹${entry['amount']}',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: isIncome ? AppColors.success : AppColors.error,
                        ),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add_rounded),
            label: Text(l.expensesAdd),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

class _SumCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final Color bgColor;

  const _SumCard({
    required this.label,
    required this.value,
    required this.color,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withAlpha(51)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                color: color,
                fontWeight: FontWeight.w600,
              )),
          const SizedBox(height: 4),
          Text(value,
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: color,
              )),
        ],
      ),
    );
  }
}
