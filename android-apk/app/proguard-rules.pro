# ProGuard rules for ICU Drip Calculator Android App

# Keep AndroidX WebKit interfaces
-keep class androidx.webkit.** { *; }
-keep class android.webkit.** { *; }

# Keep JavaScript interface methods if added
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve native Kotlin metadata
-keepclassmembers class * {
    *** valueOf(java.lang.String);
    ***[] values();
}
