Continue and improve the existing KrishiMitra mobile application shown in the uploaded screenshots. DO NOT redesign the application from scratch. Preserve the current navigation structure, Material 3 styling, spacing, colors, cards, and screen hierarchy while refining and completing missing functionality.

GENERAL DESIGN RULES

• Keep the existing clean Material 3 farmer-friendly design.
• Use the KrishiMitra earthy palette (#606C38, #6A994E, #A7C957, #DDA15E, #F8F9F3).
• Large touch targets for farmers.
• Rounded cards and buttons.
• Consistent typography.
• Maintain accessibility and simplicity.
• Design for backend integration later. Never hardcode UI that blocks future backend implementation.

--------------------------------------------------
SPLASH SCREEN
--------------------------------------------------

Replace the current splash screen.

The splash screen should only display the uploaded KrishiMitra logo centered on screen.

No large title.
No unnecessary text.
No animations except a subtle fade or gentle scale animation.
White or light earthy background.

Only show a small loading indicator if absolutely necessary.

--------------------------------------------------
VOICE ASSISTANT
--------------------------------------------------

The current implementation is incorrect.

The voice assistant should NOT allow navigation before login.

Before authentication:

The assistant may only:

• Read aloud current page contents
• Explain buttons
• Read onboarding text
• Change language

It must NOT:

• Navigate to dashboard
• Open market
• Open scan
• Open community
• Access protected pages

After successful login:

The assistant becomes context-aware.

Every page exposes only relevant commands.

Examples:

Dashboard:
- Read weather
- Read today's tasks
- Open crop details

Market:
- Search products
- Read product information
- Compare products

Weather:
- Explain forecast
- Read spraying recommendation

Scan:
- Explain diagnosis
- Read medicine recommendation

Community:
- Read posts
- Read comments

Settings:
- Explain settings

The voice assistant should always support Read Aloud for the current screen.

Leave clear placeholders for future backend voice integration.

--------------------------------------------------
ONBOARDING FLOW
--------------------------------------------------

Every onboarding page must validate required fields.

Users CANNOT continue until all mandatory information is entered.

Examples:

Phone Number
OTP
Language
Farmer Type
Land Type
Land Size
Primary Crops

The Next button remains disabled until validation passes.

--------------------------------------------------
CHOOSE MAIN CROPS
--------------------------------------------------

Improve this screen.

Instead of emojis, use unique flat crop illustrations for every crop.

Examples:

Rice
Wheat
Cotton
Sugarcane
Tomato
Onion
Banana
Groundnut
Mango
Brinjal
Okra
Chilli
Turmeric
Ginger
Maize
Millets
Coconut
Black Gram
Green Gram
Chickpea

Each crop should have its own botanical illustration.

Selection behavior:

After the user selects enough crops based on the chosen land size, display a large Get Started button fixed at the bottom of the screen.

Until sufficient crops are selected:

Keep the button disabled.

Show helper text such as:

"Select at least 3 crops to continue."

or

"Choose the crops you currently cultivate."

--------------------------------------------------
SCAN SCREEN
--------------------------------------------------

Restore the missing Scan button.

The Scan page must always contain:

Large camera preview

Capture button

Gallery button

Flash toggle

Tips for taking clear photos

After pressing Capture:

Navigate to an example AI analysis screen.

Example Result:

Disease Name

Confidence Score

Severity

Affected Area

Organic Treatment

Chemical Treatment

Preventive Measures

Recommended Products

Ask AI

Community Discussions

This is only a frontend demonstration.
Backend AI will replace this later.

--------------------------------------------------
TOUCH FEEDBACK
--------------------------------------------------

Add subtle touch feedback throughout the app.

Every tap should produce:

Small ripple animation

Short click sound

Very light haptic feedback (where supported)

Settings page must include:

Touch Sounds

ON by default

User can disable it anytime.

--------------------------------------------------
MARKETPLACE
--------------------------------------------------

Improve the Marketplace.

Keep the current layout.

Add placeholders for future live market integration.

If live market API becomes available:

Use real-time prices.

Otherwise:

Automatically switch to fallback demo data.

Create a backend integration placeholder named:

Market Data Source

with:

Live Market API

Demo Products

Offline Cache

The user should never see an empty marketplace.

Product cards should include:

Product Image

Verified Seller

Brand

Price

Discount

Rating

Availability

Wishlist

Recommended Badge

Delivery Status

--------------------------------------------------
COMMUNITY
--------------------------------------------------

Keep the current layout.

Add placeholders for:

Expert Verified Answers

AI Suggested Answer

Nearby Farmers

Most Helpful Replies

--------------------------------------------------
WEATHER
--------------------------------------------------

Keep the current layout.

Add:

Hourly Forecast

Wind Speed

Humidity

UV Index

Rain Probability

Spraying Window

Irrigation Suggestion

AI Summary

--------------------------------------------------
CROP DETAILS
--------------------------------------------------

Enhance Crop Details pages with:

Crop Health

Growth Stage

Expected Harvest

Disease Risk

Weather Risk

Today's Tasks

Market Price

Expense Summary

Yield Prediction

AI Recommendation

--------------------------------------------------
CALCULATORS
--------------------------------------------------

Retain all calculator pages.

Improve spacing.

Improve visual hierarchy.

Prepare components so backend formulas can be connected later.

--------------------------------------------------
DESIGN QUALITY
--------------------------------------------------

Do not simplify existing screens.

Do not remove any buttons.

Do not remove Scan.

Do not remove navigation.

Do not replace existing pages.

Improve the existing UI into a polished, production-ready agritech application suitable for the Smart India Hackathon while leaving clean placeholders for backend integration.