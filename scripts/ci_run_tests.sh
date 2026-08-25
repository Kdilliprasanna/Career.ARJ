#!/bin/bash
set -x

echo "Starting CI Run Tests script..."

# Source github path vars if necessary
if [ -f "$GITHUB_PATH" ]; then
    while read -r path_line; do
        export PATH="$path_line:$PATH"
    done < "$GITHUB_PATH"
fi

if [ -z "$APK_PATH" ]; then
    APK_PATH="./app/build/outputs/apk/debug/app-debug.apk"
fi

# Install APK to emulator
echo "Installing APK from $APK_PATH"
adb install -r "$APK_PATH" || echo "Warning: Failed to install APK"

# Start Appium Server
echo "Starting Appium..."
npx appium --log-level warn > /tmp/appium.log 2>&1 &
APPIUM_PID=$!

# Wait for Appium
echo "Waiting for Appium to start..."
timeout 30 bash -c 'until curl -s http://127.0.0.1:4723/status > /dev/null; do sleep 1; done'

# Execute WDIO
export WDIO_CI_SPEC="./tests/12_e2e/mega_android_1100.test.js"
echo "Running WDIO tests..."
npx wdio run wdio.conf.js
WDIO_EXIT=$?

# If WDIO exits early or fails without generating a report, fallback
if [ ! -f "Execution-Artifact.xlsx" ]; then
    echo "WDIO exit caused missing report. Generating fallback..."
    node utils/generateFallbackReport.js
fi

node utils/generateSummary.js

kill $APPIUM_PID || true
exit $WDIO_EXIT
