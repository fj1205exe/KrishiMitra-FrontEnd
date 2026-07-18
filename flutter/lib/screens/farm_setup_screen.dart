import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';

class FarmSetupScreen extends StatefulWidget {
  final String phone;
  const FarmSetupScreen({super.key, required this.phone});

  @override
  State<FarmSetupScreen> createState() => _FarmSetupScreenState();
}

class _FarmSetupScreenState extends State<FarmSetupScreen> {
  int _step = 0;

  // Step 1
  final _nameCtrl = TextEditingController();
  String? _selectedState;

  // Step 2
  final _areaCtrl = TextEditingController();
  String? _soilType;
  String? _irrigationType;

  // Step 3
  final _cropsCtrl = TextEditingController();
  final _selectedCrops = <String>{};

  static const List<String> _states = [
    'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Jharkhand',
    'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
  ];

  static const List<String> _soilTypes = [
    'Black Soil', 'Red Soil', 'Alluvial Soil', 'Sandy Soil', 'Clay Soil',
  ];

  static const List<String> _irrigationTypes = [
    'Canal', 'Borewell', 'Rainwater', 'River', 'Pond', 'No Irrigation',
  ];

  static const List<String> _commonCrops = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean',
    'Corn', 'Mustard', 'Groundnut', 'Pulses', 'Vegetables',
  ];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _areaCtrl.dispose();
    _cropsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header with step indicator
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '${l.farmStep} ${_step + 1}/3',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${((_step + 1) / 3 * 100).toInt()}%',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (_step + 1) / 3,
                      backgroundColor: AppColors.border,
                      valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                      minHeight: 6,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(l.farmSetupTitle,
                      style: Theme.of(context).textTheme.headlineMedium),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _buildStep(context, l),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  if (_step > 0)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setState(() => _step--),
                        child: Text(l.back),
                      ),
                    ),
                  if (_step > 0) const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: _canProceed ? _proceed : null,
                      child: Text(_step == 2 ? l.farmFinish : l.farmNext),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  bool get _canProceed {
    if (_step == 0) return _nameCtrl.text.isNotEmpty && _selectedState != null;
    if (_step == 1) return _areaCtrl.text.isNotEmpty && _soilType != null;
    return _selectedCrops.isNotEmpty;
  }

  void _proceed() async {
    if (_step < 2) {
      setState(() => _step++);
    } else {
      await context.read<AppProvider>().completeOnboarding(
            phone: widget.phone,
            name: _nameCtrl.text,
          );
      if (mounted) context.go('/dashboard');
    }
  }

  Widget _buildStep(BuildContext context, AppLocalizations l) {
    switch (_step) {
      case 0:
        return _StepOne(
          nameCtrl: _nameCtrl,
          selectedState: _selectedState,
          states: _states,
          onStateChanged: (v) => setState(() => _selectedState = v),
          onNameChanged: () => setState(() {}),
          l: l,
        );
      case 1:
        return _StepTwo(
          areaCtrl: _areaCtrl,
          soilType: _soilType,
          irrigationType: _irrigationType,
          soilTypes: _soilTypes,
          irrigationTypes: _irrigationTypes,
          onSoilChanged: (v) => setState(() => _soilType = v),
          onIrrigationChanged: (v) => setState(() => _irrigationType = v),
          onAreaChanged: () => setState(() {}),
          l: l,
        );
      case 2:
        return _StepThree(
          selectedCrops: _selectedCrops,
          crops: _commonCrops,
          onToggle: (c) => setState(() {
            if (_selectedCrops.contains(c)) {
              _selectedCrops.remove(c);
            } else {
              _selectedCrops.add(c);
            }
          }),
          l: l,
        );
      default:
        return const SizedBox();
    }
  }
}

class _StepOne extends StatelessWidget {
  final TextEditingController nameCtrl;
  final String? selectedState;
  final List<String> states;
  final ValueChanged<String?> onStateChanged;
  final VoidCallback onNameChanged;
  final AppLocalizations l;

  const _StepOne({
    required this.nameCtrl,
    required this.selectedState,
    required this.states,
    required this.onStateChanged,
    required this.onNameChanged,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FieldLabel(l.farmName),
        const SizedBox(height: 8),
        TextField(
          controller: nameCtrl,
          onChanged: (_) => onNameChanged(),
          decoration: InputDecoration(
            hintText: l.farmNameHint,
            prefixIcon: const Icon(Icons.agriculture_rounded,
                color: AppColors.primary),
          ),
        ),
        const SizedBox(height: 20),
        _FieldLabel(l.farmState),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: selectedState,
          hint: Text(l.farmState),
          decoration: const InputDecoration(),
          borderRadius: BorderRadius.circular(16),
          items: states
              .map((s) => DropdownMenuItem(value: s, child: Text(s)))
              .toList(),
          onChanged: onStateChanged,
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}

class _StepTwo extends StatelessWidget {
  final TextEditingController areaCtrl;
  final String? soilType;
  final String? irrigationType;
  final List<String> soilTypes;
  final List<String> irrigationTypes;
  final ValueChanged<String?> onSoilChanged;
  final ValueChanged<String?> onIrrigationChanged;
  final VoidCallback onAreaChanged;
  final AppLocalizations l;

  const _StepTwo({
    required this.areaCtrl,
    required this.soilType,
    required this.irrigationType,
    required this.soilTypes,
    required this.irrigationTypes,
    required this.onSoilChanged,
    required this.onIrrigationChanged,
    required this.onAreaChanged,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FieldLabel(l.farmArea),
        const SizedBox(height: 8),
        TextField(
          controller: areaCtrl,
          keyboardType: TextInputType.number,
          onChanged: (_) => onAreaChanged(),
          decoration: InputDecoration(
            hintText: l.farmAreaHint,
            suffixText: 'acres',
            prefixIcon:
                const Icon(Icons.straighten_rounded, color: AppColors.primary),
          ),
        ),
        const SizedBox(height: 20),
        _FieldLabel(l.farmSoilType),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: soilTypes.map((s) {
            final selected = soilType == s;
            return FilterChip(
              label: Text(s),
              selected: selected,
              onSelected: (_) => onSoilChanged(s),
              selectedColor: AppColors.primary,
              checkmarkColor: Colors.white,
              labelStyle: TextStyle(
                color: selected ? Colors.white : AppColors.textPrimary,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w600,
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),
        _FieldLabel(l.farmIrrigation),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: irrigationTypes.map((s) {
            final selected = irrigationType == s;
            return FilterChip(
              label: Text(s),
              selected: selected,
              onSelected: (_) => onIrrigationChanged(s),
              selectedColor: AppColors.primary,
              checkmarkColor: Colors.white,
              labelStyle: TextStyle(
                color: selected ? Colors.white : AppColors.textPrimary,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w600,
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}

class _StepThree extends StatelessWidget {
  final Set<String> selectedCrops;
  final List<String> crops;
  final ValueChanged<String> onToggle;
  final AppLocalizations l;

  const _StepThree({
    required this.selectedCrops,
    required this.crops,
    required this.onToggle,
    required this.l,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FieldLabel(l.farmCrops),
        const SizedBox(height: 4),
        Text(l.tapToSelect,
            style: const TextStyle(
                fontSize: 12, color: AppColors.textSecondary, fontFamily: 'Inter')),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
          ),
          itemCount: crops.length,
          itemBuilder: (_, i) {
            final crop = crops[i];
            final selected = selectedCrops.contains(crop);
            return GestureDetector(
              onTap: () => onToggle(crop),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                decoration: BoxDecoration(
                  color: selected ? AppColors.primarySurface : AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? AppColors.primary : AppColors.border,
                    width: selected ? 2 : 1,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (selected)
                      const Icon(Icons.check_rounded,
                          color: AppColors.primary, size: 18),
                    if (selected) const SizedBox(width: 4),
                    Text(
                      crop,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: selected
                            ? AppColors.primary
                            : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
    );
  }
}
