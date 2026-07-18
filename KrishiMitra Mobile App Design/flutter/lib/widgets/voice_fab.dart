import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../l10n/app_localizations.dart';

/// Drop this anywhere in a Stack — it manages its own position and can be
/// dragged freely. Snaps to the nearest horizontal edge when released.
class VoiceFab extends StatefulWidget {
  const VoiceFab({super.key});

  @override
  State<VoiceFab> createState() => _VoiceFabState();
}

class _VoiceFabState extends State<VoiceFab>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulse;

  // Initial position — bottom-right above bottom nav
  Offset _pos = const Offset(-1, -1); // -1 means "not yet initialized"
  bool _dragging = false;

  static const double _btnSize = 56.0;
  static const double _margin = 20.0;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  void _showVoiceSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => const _VoiceSheet(),
    );
  }

  Offset _clampToScreen(Offset pos, Size screen) {
    final maxX = screen.width - _btnSize - _margin;
    final maxY = screen.height - _btnSize - _margin - 80; // 80 = approx bottom nav
    return Offset(
      pos.dx.clamp(_margin, maxX),
      pos.dy.clamp(_margin + MediaQuery.of(context).padding.top, maxY),
    );
  }

  void _snapToEdge(Size screen) {
    final center = _pos.dx + _btnSize / 2;
    final snappedX = center < screen.width / 2
        ? _margin
        : screen.width - _btnSize - _margin;
    setState(() {
      _pos = _clampToScreen(Offset(snappedX, _pos.dy), screen);
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    // Initialize position on first frame
    if (_pos.dx < 0) {
      _pos = Offset(
        size.width - _btnSize - _margin,
        size.height - _btnSize - 90, // above bottom nav
      );
    }

    return Positioned(
      left: _pos.dx,
      top: _pos.dy,
      child: GestureDetector(
        onPanStart: (_) => setState(() => _dragging = true),
        onPanUpdate: (d) {
          setState(() {
            _pos = _clampToScreen(_pos + d.delta, size);
          });
        },
        onPanEnd: (_) {
          setState(() => _dragging = false);
          _snapToEdge(size);
        },
        onTap: _showVoiceSheet,
        child: AnimatedBuilder(
          animation: _pulse,
          builder: (_, child) => Container(
            width: _btnSize,
            height: _btnSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.highlight.withAlpha(
                    _dragging ? 120 : ((_pulse.value * 0.5 + 0.3) * 255).toInt(),
                  ),
                  blurRadius: _dragging ? 24 : 20 + _pulse.value * 10,
                  spreadRadius: _dragging ? 6 : _pulse.value * 4,
                ),
              ],
            ),
            child: child,
          ),
          child: AnimatedScale(
            scale: _dragging ? 1.12 : 1.0,
            duration: const Duration(milliseconds: 150),
            child: Container(
              width: _btnSize,
              height: _btnSize,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.highlight,
                    AppColors.highlight.withRed(
                        (AppColors.highlight.r * 0.85).toInt()),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                shape: BoxShape.circle,
              ),
              child: Icon(
                _dragging ? Icons.open_with_rounded : Icons.mic_rounded,
                color: AppColors.textPrimary,
                size: 26,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _VoiceSheet extends StatefulWidget {
  const _VoiceSheet();

  @override
  State<_VoiceSheet> createState() => _VoiceSheetState();
}

class _VoiceSheetState extends State<_VoiceSheet> {
  bool _listening = false;

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    final List<Map<String, dynamic>> commands = [
      {'icon': Icons.store_rounded, 'label': l.dashMarket},
      {'icon': Icons.wb_sunny_rounded, 'label': l.dashWeather},
      {'icon': Icons.camera_alt_rounded, 'label': l.dashDisease},
      {'icon': Icons.account_balance_rounded, 'label': l.dashSchemes},
      {'icon': Icons.chat_bubble_rounded, 'label': l.navChat},
      {'icon': Icons.bar_chart_rounded, 'label': l.dashExpenses},
    ];

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),
          Text(l.voiceTitle, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(l.voiceHint,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center),
          ),
          const SizedBox(height: 24),
          // Mic button
          GestureDetector(
            onTap: () => setState(() => _listening = !_listening),
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: _listening ? AppColors.error : AppColors.highlight,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: (_listening ? AppColors.error : AppColors.highlight)
                        .withAlpha(77),
                    blurRadius: 20,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Icon(
                _listening ? Icons.stop_rounded : Icons.mic_rounded,
                color: Colors.white,
                size: 36,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _listening ? l.voiceListening : l.voiceTryAsk,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              color: _listening ? AppColors.error : AppColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: commands
                  .map((cmd) => _CommandTile(
                        icon: cmd['icon'] as IconData,
                        label: cmd['label'] as String,
                        onTap: () => Navigator.pop(context),
                      ))
                  .toList(),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _CommandTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _CommandTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.primarySurface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: AppColors.primary, size: 28),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
