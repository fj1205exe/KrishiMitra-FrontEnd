import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../l10n/app_localizations.dart';
import '../theme/app_colors.dart';

class LoginScreen extends StatefulWidget {
  final String phone;
  const LoginScreen({super.key, required this.phone});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _controller = TextEditingController();
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    if (widget.phone.isNotEmpty) _controller.text = widget.phone;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _sendOtp() async {
    if (_controller.text.length != 10) return;
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 800));
    if (mounted) {
      context.go('/otp?phone=${_controller.text}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Hero illustration
              Center(
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    gradient: AppColors.heroGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text('👨‍🌾', style: TextStyle(fontSize: 64)),
                  ),
                ),
              ),
              const SizedBox(height: 36),
              Text(l.loginTitle,
                  style: Theme.of(context).textTheme.displaySmall),
              const SizedBox(height: 8),
              Text(l.loginSub, style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 32),
              // Phone field
              Text(l.loginPhone,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  )),
              const SizedBox(height: 8),
              TextField(
                controller: _controller,
                keyboardType: TextInputType.phone,
                maxLength: 10,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: l.loginPhoneHint,
                  counterText: '',
                  prefixIcon: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 14),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('🇮🇳', style: TextStyle(fontSize: 20)),
                        SizedBox(width: 8),
                        Text('+91',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            )),
                      ],
                    ),
                  ),
                ),
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed:
                    _controller.text.length == 10 && !_loading ? _sendOtp : null,
                child: _loading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor:
                              AlwaysStoppedAnimation(Colors.white),
                        ),
                      )
                    : Text(l.loginSendOtp),
              ),
              const SizedBox(height: 20),
              Center(
                child: Text(
                  l.loginAgreement,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
