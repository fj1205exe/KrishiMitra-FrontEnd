import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';
import '../widgets/krishi_bottom_nav.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _analyzing = false;

  void _mockScan() async {
    setState(() => _analyzing = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      context.go('/scan-result');
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Row(
                children: [
                  Text(l.scanTitle,
                      style: Theme.of(context).textTheme.headlineMedium),
                ],
              ),
            ),
            // Camera viewfinder mock
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A2314),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.primary, width: 2),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Corner guides
                      ..._corners(),
                      if (_analyzing)
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation(AppColors.primary),
                              strokeWidth: 3,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              l.scanAnalyzing,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        )
                      else
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('🌿', style: TextStyle(fontSize: 64)),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 20, vertical: 10),
                              decoration: BoxDecoration(
                                color: Colors.black.withAlpha(128),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                l.scanInstruction,
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ),
            // Action buttons
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  ElevatedButton.icon(
                    onPressed: _analyzing ? null : _mockScan,
                    icon: const Icon(Icons.camera_alt_rounded),
                    label: Text(l.scanCapture),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: _analyzing ? null : _mockScan,
                    icon: const Icon(Icons.photo_library_rounded),
                    label: Text(l.scanGallery),
                  ),
                ],
              ),
            ),
            const KrishiBottomNav(currentIndex: 2),
          ],
        ),
      ),
    );
  }

  List<Widget> _corners() {
    const size = 30.0;
    const thick = 3.0;
    const color = AppColors.secondary;
    const r = Radius.circular(6);

    Widget corner(AlignmentGeometry align, BorderRadius br) {
      return Positioned(
        left: align == Alignment.topLeft || align == Alignment.bottomLeft
            ? 24
            : null,
        right: align == Alignment.topRight || align == Alignment.bottomRight
            ? 24
            : null,
        top: align == Alignment.topLeft || align == Alignment.topRight
            ? 24
            : null,
        bottom: align == Alignment.bottomLeft || align == Alignment.bottomRight
            ? 24
            : null,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            border: Border(
              top: br.topLeft != Radius.zero
                  ? const BorderSide(color: color, width: thick)
                  : BorderSide.none,
              left: br.topLeft != Radius.zero
                  ? const BorderSide(color: color, width: thick)
                  : BorderSide.none,
              bottom: br.bottomLeft != Radius.zero
                  ? const BorderSide(color: color, width: thick)
                  : BorderSide.none,
              right: br.bottomRight != Radius.zero
                  ? const BorderSide(color: color, width: thick)
                  : BorderSide.none,
            ),
            borderRadius: br,
          ),
        ),
      );
    }

    return [
      corner(Alignment.topLeft,
          const BorderRadius.only(topLeft: r)),
      corner(Alignment.topRight,
          const BorderRadius.only(topRight: r)),
      corner(Alignment.bottomLeft,
          const BorderRadius.only(bottomLeft: r)),
      corner(Alignment.bottomRight,
          const BorderRadius.only(bottomRight: r)),
    ];
  }
}
