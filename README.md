# expo-app-integrity

## Why?
Integrate with Apple's App Attest API and Android's Play Integrity API via a unified JavaScript API for Expo applications without Firebase.

This library offers a unified API for those that want to roll their own backend services.

## Pre-requisites and Introduction
This library requires that you are following the ["bare" Expo workflow](https://docs.expo.dev/archive/managed-vs-bare).

This library requires a deployment target of iOS `14.0` or higher.

For iOS, you'll need an Apple Developer account ($100 / year) to create an `eas` development build of your app to work with. **App Attest does not work in the Simulator**. You'll need to configure your development team and enable the App Attest capability for your app in XCode.

For Android, you'll need a Google Developer Profile (one-time payment of $25). Play Integrity API does work in emulators with the Play Store installed.

While this library encapsulates the intricacies of the two app attestation APIs into one library, you'll want to familiarize yourself with the basics for each one:

[Android Play Integrity API](https://developer.android.com/google/play/integrity/overview)

[iOS App Attest](https://developer.apple.com/documentation/devicecheck/preparing_to_use_the_app_attest_service)

**This library only covers the client-side parts of app attestation.** Your server will be responsible for:
1) generating an unpredictable nonce challenge to ensure attackers cannot replay attestation tokens from Apple and Google, and
2) verifying the validity of the attestation token by assuring that it is i)  from Apple or Google, and ii)  that the nonce challenge was the one your server generated for this particular attestation challenge.

### Before you start

#### Have a rollout strategy if you're introducing attestation to an established app with many users

App Attest and Play Integrity API *are* external services that require a network connection, and like many APIs, are subject to rate-limiting. You will need a rollout strategy if you are implementing attestation and you already have many users.

#### Consider whether a tiered or zero-tolerance policy for unattested requests is best for your app

You likely will need a decision strategy in your code and/or organization for handling unattested requests in the event that Apple's / Google's servers are unavailable, or if your app needs broader support than the subset of iOS 14.0+ devices that support App Attest. 

While we side with [this article](https://swiftrocks.com/app-attest-apple-protect-ios-jailbreak) that it's safest to adopt a zero-tolerance policy for unattested requests to your server, `expo-app-integrity` still exposes App Attest's `isSupported` API in JavaScript so that you can choose whether to bypass the service yourself.

This doesn't account for transient device errors or degradations in the Apple and Google services, either. Generally, you'll want to retry with exponential backoff in those events, but you may simply wish not to penalize users for faults outside of your organization's control.

Requests can, then, be enumerated into four groups:
1) **Attested**
2) **Unattested (outdated)**, such as if your app's access tokens contingent on attestation have a long expiration date
3) **Unattested (bad actor)**, such as if an attestation token was generated with an outdated / invalid nonce from your server, or if verification from Apple / Google fails
4) **Unknown** - Google / Apple services are degraded and you are unable to verify the request

Deciding what outcomes are available for four groups of requests on top of other authorization rules your organization might have might be cumbersome for indie developers or small development teams.

***Note:** You may notice that Apple's documentation as far as *which* subset of devices support App Attest / Device Check is especially vague. If you have this information, please create an issue and let us know, so that others can make an informed decision on whether they should adopt a zero-tolerance or tiered policy for unattested requests.*

## Installation
### Install the Expo Module
```
npx expo install expo-app-integrity
```

## Install Peer Dependencies
`expo-app-integrity`  requires the following peer dependencies:
```
npx expo install expo-secure-store expo-build-properties expo-device
```
### Configure for iOS

This module uses `expo-secure-store` to encrypt your user's iOS AppAttest `keyIdentifier`, and `expo-build-properties` to ensure that your app's deployment target is iOS 14.0. These require the following configuration in your app's `app.json`:
```
{
  "expo": { ... },
  "plugins": [
   "expo-secure-store",
    [
      "expo-build-properties",
      {
        "ios": {
          "deploymentTarget": "14.0"
        }
      }
    ],
  ]
}
```
### Rebuild
After installing these Expo modules, you will need to rebuild the `/ios` and `/android` directories. After creating an initial `eas` development build for each platform, this can be done via the "play" / "build" buttons in Xcode and Android Studio, or `npx expo run:ios` and `npx expo run:android`.

## API
### Import
```TypeScript
import * as Integrity from 'expo-app-integrity'
```

### `isSupported()`
Check for iOS device support.
```TypeScript
Integrity.isSupported(): boolean | never
```
**iOS Only** -  Wrap in a platform check if adopting a tiered policy for unattested requests and you need to support both platforms.
```TypeScript
import * as Integrity from 'expo-app-integrity'
import { Platform } from 'react-native'

// ...

if (Platform.OS === 'ios' && Integrity.isSupported()) {
  // attest key
}
```

### `attestKey()`
Request an attestation token from Apple or Google servers.
```TypeScript
/** 
 * @throws AppIntegrityError | UnhandledException
 */
Integrity.attestKey(
  challenge: string,
  cloudProjectNumber?: number
): Promise<string | never>
```

### Errors
Errors are enumerations of the `DCError` (Device Check) class (iOS) or the `IntegrityServiceException` class (Android), with a few `expo-app-integrity` additions for handling platform agnosticism.

All possible errors and their resolutions are laid out here:

[iOS](./src/errors/iOS.ts)

[Android](./src/errors/Android.ts)

[`expo-app-integrity`-specific](./src/errors/PlatformAgnostic.ts)
