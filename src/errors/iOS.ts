import { ErrorResolutionTypes, type AppIntegrityError } from './types'

export const iOSAppAttestErrors: { [code: string]: AppIntegrityError } = {
  UNKNOWN_SYSTEM_FAILURE: {
    code: 'UNKNOWN_SYSTEM_FAILURE',
    errorCode: 20,
    documentation:
      'https://developer.apple.com/documentation/devicecheck/dcerror/2896947-unknownsystemfailure',
    detail: 'A failure has occurred, such as the failure to generate a token.',
    userFriendlyMessage:
      'App integrity verification failed. Please try again. Error code: 25',
    resolution: 'Retry with an exponential backoff.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  INVALID_KEY: {
    code: 'INVALID_KEY',
    errorCode: 21,
    documentation:
      'https://developer.apple.com/documentation/devicecheck/dcerror/3585177-invalidkey',
    detail: 'An error caused by a failed attempt to use the App Attest key',
    userFriendlyMessage:
      'App integrity verification failed. Please try again. Error code: 21',
    resolution:
      'An invalid or non-existent key was used to verify the app. Ensure that peer-dependency `expo-secure-store` is installed in your project to securely store the key identifier, and rebuild the iOS app. Please file an issue with `expo-app-integrity` if this issue persists.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    errorCode: 22,
    documentation:
      'https://developer.apple.com/documentation/devicecheck/dcerror/3585176-invalidinput',
    detail:
      "An error code that indicates when your app provides data that isn't formatted correctly.",
    userFriendlyMessage:
      'App integrity verification failed. Please try again. Error code: 22',
    resolution:
      'The challenge provided to the App Attest API must be utf8 and hashable via SHA256. Assertion request bodies must be JSON strings.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  SERVER_UNAVAILABLE: {
    code: 'SERVER_UNAVAILABLE',
    errorCode: 23,
    documentation:
      'https://developer.apple.com/documentation/devicecheck/dcerror/3585178-serverunavailable',
    detail:
      "An error that indicates a failed attempt to contact the App Attest service during an attestation. You receive this error when you call attestKey(_:clientDataHash:completionHandler:) and the framework isn't able to complete the attestation. If you receive this error, try the attestation again later using the same key and the same value for the clientDataHash parameter. Retrying with the same inputs helps to preserve the risk metric for a given device.",
    userFriendlyMessage:
      'App integrity verification failed. Apple App Attest services may be temporarily degraded. Please try again. Error code: 23',
    resolution: 'Retry with an exponential backoff.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  FEATURE_UNSUPPORTED: {
    code: 'FEATURE_UNSUPPORTED',
    errorCode: 24,
    documentation:
      'https://developer.apple.com/documentation/devicecheck/dcerror/2896943-featureunsupported',
    detail: 'DeviceCheck is not available on this device.',
    userFriendlyMessage:
      'App integrity verification failed. Please try again on another device. Error code: 24',
    resolution:
      'App Attest will always fail on this device. You must test on a physical device and ensure App Attest capabilities are enabled for your app. If you need broader device support, consider adopting a (more complex) tiered approach to app integrity verification and wrapping your call(s) to `Integrity.attestKey()` and `Integrity.generateAssertion()` in `Integrity.isSupported()`. For more information, see the Apple documentation on checking for availability here: https://developer.apple.com/documentation/devicecheck/establishing_your_app_s_integrity#3576028. However, `expo-app-integrity` sides with this article, suggesting not to use `Integrity.isSupported()` to gate your app integrity verification.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  EXECUTED_IN_SIMULATOR: {
    code: 'EXECUTED_IN_SIMULATOR',
    errorCode: 25,
    documentation:
      'How to create an iOS development build with EAS: https://docs.expo.dev/build/setup/',
    detail:
      'App Attest requires a physical device and will not work in a simulator.',
    userFriendlyMessage:
      'App integrity verification failed. Please try again on another device. Error code: 25',
    resolution:
      'You will need an Apple Developer Account and an iOS development build of your application to test this functionality.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },
}
