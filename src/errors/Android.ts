import { ErrorResolutionTypes, type AppIntegrityError } from './types'

export const AndroidIntegrityErrors: { [code: string]: AppIntegrityError } = {
  /**
   * Non-actionable errors
   */

  APP_NOT_INSTALLED: {
    code: 'APP_NOT_INSTALLED',
    errorCode: 0,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#APP_NOT_INSTALLED',
    detail:
      'The calling app is not installed. Something is wrong (possibly an attack). Presumably, this indicates that your executable was run without formal installation via Google Play.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 0',
    resolution: 'Non-actionable',
    resolutionType: ErrorResolutionTypes.NON_ACTIONABLE,
  },

  API_UID_MISMATCH: {
    code: 'API_UID_MISMATCH',
    errorCode: 1,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#API_UID_MISMATCH',
    detail:
      'The calling app UID (user id) does not match the one from Package Manager. Something is wrong (possibly an attack). Non-actionable.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 1',
    resolution: 'Non-actionable',
    resolutionType: ErrorResolutionTypes.NON_ACTIONABLE,
  },

  /**
   * Errors that may require end-user resolution
   */

  API_NOT_AVAILABLE: {
    code: 'API_NOT_AVAILABLE',
    errorCode: 2,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#API_NOT_AVAILABLE',
    detail:
      'Integrity API is not available. Integrity API is not enabled, or the Play Store version might be old.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please update Play Store on your device and try again. Error code: 2',
    resolution:
      'Make sure that Integrity API is enabled in Google Play Console for your application. Ask the user to update Play Store before trying again.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  CANNOT_BIND_TO_SERVICE: {
    code: 'CANNOT_BIND_TO_SERVICE',
    errorCode: 3,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CANNOT_BIND_TO_SERVICE',
    detail:
      'Binding to the service in the Play Store has failed. This can be due to having an old Play Store version installed on the device.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please update Play Store on your device and try again. Error code: 3',
    resolution: 'Ask the user to update Play Store before trying again.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    errorCode: 4,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NETWORK_ERROR',
    detail: 'No available network is found.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please check your internet connection and try again. Error code: 4',
    resolution: 'Ask the user to check for a connection before trying again.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  PLAY_SERVICES_NOT_FOUND: {
    code: 'PLAY_SERVICES_NOT_FOUND',
    errorCode: 5,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_SERVICES_NOT_FOUND',
    detail: 'Play Services is not available or version is too old.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please ensure Play Services is installed on your device and up-to-date, and try again. Error code: 5',
    resolution: 'Ask the user to Install or Update Play Services.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  PLAY_SERVICES_VERSION_OUTDATED: {
    code: 'PLAY_SERVICES_VERSION_OUTDATED',
    errorCode: 6,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_SERVICES_VERSION_OUTDATED',
    detail: 'Play Services needs to be updated.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please update Play Services on your device and try again. Error code: 6',
    resolution: 'Ask the user to update Play Services before trying again.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  PLAY_STORE_ACCOUNT_NOT_FOUND: {
    code: 'PLAY_STORE_ACCOUNT_NOT_FOUND',
    errorCode: 7,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_ACCOUNT_NOT_FOUND',
    detail:
      'No Play Store account is found on device. Note that the Play Integrity API now supports unauthenticated requests. This error code is used only for older Play Store versions that lack support.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please ensure you are logged into the Play Store on your device and try again. Error code: 7',
    resolution: 'Ask the user to authenticate in Play Store.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  PLAY_STORE_NOT_FOUND: {
    code: 'PLAY_STORE_NOT_FOUND',
    errorCode: 8,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_NOT_FOUND',
    detail:
      'No Play Store app is found on device or unofficial version is installed.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please ensure you have the official Play Store app installed on your device and try again. Error code: 8',
    resolution:
      'Ask the user to install an official and recent version of Play Store.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  PLAY_STORE_VERSION_OUTDATED: {
    code: 'PLAY_STORE_VERSION_OUTDATED',
    errorCode: 9,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_VERSION_OUTDATED',
    detail: 'Play Store needs to be updated.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please update Play Store on your device and try again. Error code: 9',
    resolution: 'Ask the user to update Play Store before trying again.',
    resolutionType: ErrorResolutionTypes.USER_ACTION_REQUIRED,
  },

  /**
   * Errors recommending retry with an exponential backoff
   */

  CLIENT_TRANSIENT_ERROR: {
    code: 'CLIENT_TRANSIENT_ERROR',
    errorCode: 10,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CLIENT_TRANSIENT_ERROR',
    detail:
      'There was a transient error in the client device. Retry with an exponential backoff. Introduced in Integrity Play Core version 1.1.0 (prior versions returned a token with empty Device Integrity Verdict). If the error persists after a few retries, you should assume that the device has failed integrity checks and act accordingly.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 10',
    resolution:
      'Retry with an exponential backoff. Consider filing a bug if it fails consistently.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  GOOGLE_SERVER_UNAVAILABLE: {
    code: 'GOOGLE_SERVER_UNAVAILABLE',
    errorCode: 11,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#GOOGLE_SERVER_UNAVAILABLE',
    detail: 'Unknown internal Google server error.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Google services may be temporarily degraded. Please try again. Error code: 11',
    resolution:
      'Retry with an exponential backoff. Consider filing a bug if it fails consistently.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    errorCode: 12,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#INTERNAL_ERROR',
    detail: 'Unknown internal error.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Google services may be temporarily degraded. Please try again. Error code: 12',
    resolution:
      'Retry with an exponential backoff. Consider filing a bug if it fails consistently.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  /**
   * Library consumer configuration errors
   */
  CLOUD_PROJECT_NUMBER_IS_INVALID: {
    code: 'CLOUD_PROJECT_NUMBER_IS_INVALID',
    errorCode: 13,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CLOUD_PROJECT_NUMBER_IS_INVALID',
    detail:
      'Configuration error: the provided cloud project number is invalid. Use the cloud project number which can be found in Project info in your Google Cloud Console for the cloud project where Play Integrity API is enabled.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 13',
    resolution: 'Ensure the cloud project number is correct.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  NONCE_IS_NOT_BASE64: {
    code: 'NONCE_IS_NOT_BASE64',
    errorCode: 14,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_IS_NOT_BASE64',
    detail:
      'Configuration error: the provided nonce is not encoded as a base64 web-safe no-wrap string. Retry with correct nonce format.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 14',
    resolution:
      'Ensure the nonce is encoded as a base64 web-safe no-wrap string.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  NONCE_TOO_LONG: {
    code: 'NONCE_TOO_LONG',
    errorCode: 15,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_TOO_LONG',
    detail:
      'Configuration error: the provided nonce is too long. The nonce must be less than 500 bytes before base64 encoding. Retry with a shorter nonce.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 15',
    resolution:
      'Ensure the nonce is less than 500 bytes before base64 encoding.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  NONCE_TOO_SHORT: {
    code: 'NONCE_TOO_SHORT',
    errorCode: 16,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_TOO_SHORT',
    detail:
      'Configuration error: the provided nonce is too short. The nonce must be a minimum of 16 bytes (before base64 encoding). Retry with a longer nonce.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 16',
    resolution:
      'Ensure the nonce is a minimum of 16 bytes (before base64 encoding).',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  TOO_MANY_REQUESTS: {
    code: 'TOO_MANY_REQUESTS',
    errorCode: 17,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#TOO_MANY_REQUESTS',
    detail:
      'The calling app is making too many requests to the API and hence is throttled.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 17',
    resolution: 'Retry with an exponential backoff.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },

  /** ??? */

  NO_ERROR: {
    code: 'NO_ERROR',
    errorCode: 18,
    documentation:
      'https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NO_ERROR',
    detail:
      'No error occurred. This error code was likely included in the App Integrity API for completeness.',
    userFriendlyMessage: 'No error occurred. Error code: 18',
    resolution: 'No resolution is required.',
    resolutionType: ErrorResolutionTypes.NON_ACTIONABLE,
  },

  /**
   * Errors created by expo-app-integrity
   */

  INVALID_INTEGRITY_TOKEN_RESPONSE: {
    code: 'INVALID_INTEGRITY_TOKEN_RESPONSE',
    errorCode: 19,
    documentation: 'https://gihub.com/jeffDevelops/expo-app-integrity',
    detail:
      'Google Play Integrity API did not return an error, but the integrity token was null',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 19',
    resolution:
      'Retry with an exponential backoff. Consider filing a bug with `expo-app-integrity` repository if it fails consistently.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },
  INVALID_IS_SUPPORTED_API: {
    code: 'INVALID_IS_SUPPORTED_API',
    errorCode: 20,
    documentation: 'https://gihub.com/jeffDevelops/expo-app-integrity',
    detail:
      '`AppIntegrity.isSupported()` is only exposed on iOS, but was called on Android.',
    userFriendlyMessage:
      'App integrity verification with the Google Play Store failed. Please try again. Error code: 20',
    resolution:
      "`expo-app-integrity` does not recommend using this part of Apple's API unless you have a strategy for handling unattested requests in your app. If you do elect to use it on iOS, be sure to wrap this call in a check for an `ios` `Platform.OS`.",
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },
}
