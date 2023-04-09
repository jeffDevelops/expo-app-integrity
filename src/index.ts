import * as Device from 'expo-device'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

import IntegrityModule from './IntegrityModule'
import { SECURE_STORAGE_KEYS } from './config'
import {
  iOSAppAttestErrors,
  AndroidIntegrityErrors,
  unhandledException,
  PlatformAgnosticErrors,
} from './errors'

/** iOS Only */
const generateKey = async (): Promise<string | never> =>
  await IntegrityModule.generateKey()

const iOSAttestKey = async (challenge: string): Promise<string | never> => {
  if (!Device.isDevice) throw iOSAppAttestErrors.EXECUTED_IN_SIMULATOR

  try {
    // Check secure storage for a key identifier
    const secureStorageValue = await SecureStore.getItemAsync(
      SECURE_STORAGE_KEYS.INTEGRITY_KEY_IDENTIFIER,
    )

    // Generate a key if one doesn't exist in secure storage
    const keyIdentifier = secureStorageValue ?? (await generateKey())

    // Save the key identifier to secure storage if it didn't originally exist
    if (!secureStorageValue)
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.INTEGRITY_KEY_IDENTIFIER,
        keyIdentifier,
      )

    const attestationResult = await IntegrityModule.attestKey(
      keyIdentifier,
      challenge,
    )

    return attestationResult
  } catch (error) {
    const errorCode =
      error.message.split(' ')[error.message.split(' ').length - 1]

    if (!iOSAppAttestErrors[errorCode]) throw unhandledException(error.message)
    throw iOSAppAttestErrors[errorCode]
  }
}

const androidRequestIntegrityVerdict = async (
  challenge: string,
  cloudProjectNumber: number,
): Promise<string | never> => {
  try {
    const verdict = await IntegrityModule.requestIntegrityVerdict(
      challenge,
      cloudProjectNumber,
    )
    return verdict
  } catch (error) {
    // Remove last paren character from stringified error message (i.e., "Error(...)" -> "Error(1234")
    const formattedError = error.message.substring(0, error.message.length - 1)
    const errorToArray = formattedError.split(' ')

    // The error code token is the last token in the error message array
    const errorCode = errorToArray[errorToArray.length - 1]

    if (!AndroidIntegrityErrors[errorCode])
      throw unhandledException(error.message)

    throw AndroidIntegrityErrors[errorCode]
  }
}

/**
 * @description
 * iOS Only. Check if the device supports iOS AppAttest.
 *
 * Attestation support is handled via an extensive system of exceptions after the service is requested. Running this function on Android will throw an error. Wrap in a platform check if you need to support both platforms.
 *
 * `AppIntegrity.isSupported()` is only exposed on iOS, but `expo-app-integrity` recommends not to use the API at all, in spite of Apple's recommendations. Apple includes the API so as not to
 * penalize users if AppAttest isn't supported on the device they're using. `AppIntegrity.isSupported()` is included in this API so that you can adopt Apple's recommended approach in your Expo
 * app if you so choose, but you'll need to have a strategy in place to determine the outcomes of unattested requests.
 *
 * Apple's recommendation for checking for AppAttest support: https://developer.apple.com/documentation/devicecheck/establishing_your_app_s_integrity#3576028
 *
 * Why you might not want to follow Apple's recommendation: https://swiftrocks.com/app-attest-apple-protect-ios-jailbreak
 *
 * Android has no such API, so you'll need to wrap this call in a check for an `'ios'` `Platform.OS`. On Android, whether the functionality is supported can be gleaned from simply trying to make
 * the request.`try` `AppIntegrity.attestKey` and handle API availability errors based on Google's recommendations for any error message you receive (i.e., project configuration errors, exponential
 * backoff)."
 **/
export const isSupported = (): boolean => IntegrityModule.isSupported()

/**
 *
 * @param challenge
 * @param cloudProjectNumber
 * @returns string | never
 *
 * @description
 * This is generally the only function from the module that you'll need to get an app integrity attestation from AppAttest / Google Play Integrity API.
 *
 * On iOS, this function:
 *
 * 1) Generates a key if one doesn't exist and store its identifier in secure storage as exposed in peer-dependency `expo-secure-store`. It will use the identifier
 * from the secure store if this function was already called on the user's device.
 *
 * 2) Calls `DCAppAttestService.attestKey` with your persisted key identifier and server-generated challenge to get an attestation from Apple servers. This action IS
 * subject to Apple's rate limiting, so you'll need to prepare your app with any / all of the following measures.
 *
 * - you should implement exponential backoff for failed attestation requests
 * - Onboard Users Gradually: if you already have a large user base, you'll need to incrementally introduce your attestation feature to subsets of your user base
 * - you may need to implement decision logic that is less stringent than simply rejecting unattested requests, and progressively tighten requirements if unattested traffic increases
 *
 * On Android, this function calls `GooglePlayIntegrity.requestIntegrityToken` with your server-generated challenge and project's Google Cloud Project Number to get an attestation from
 * Google Play servers.
 *
 * BOTH iOS and Android APIs are subject to rate limiting, so you'll need to prepare your app with any / all of the following measures:
 * - you should implement exponential backoff for failed attestation requests
 * - Onboard Users Gradually: if you already have a large user base, you'll need to incrementally introduce your attestation feature to subsets of your user base
 * - you may need to implement decision logic that is less stringent than simply rejecting unattested requests, and progressively tighten requirements if unattested traffic increases
 *
 * See Apple's documentation on preparing to use AppAttest for more information: https://developer.apple.com/documentation/devicecheck/preparing_to_use_the_app_attest_service
 * See Google's overview on using the Play Integrity API: https://developer.android.com/google/play/integrity/overview
 *
 * @throws
 * On iOS:
 * This function can throw errors that extend the `DCError` struct:
 * - `'INVALID_KEY'`: The key identifier is incorrect or was not provided. This is likely to be an issue with an implementation detail of `expo-app-integrity`, so file an issue on the repo if you encounter this error.
 * - `'INVALID_INPUT'`: An error code that indicates when your app provides data that isn't formatted correctly. Ensure that you're passing a valid challenge string.
 * - `'SERVER_UNAVAILABLE'`: An error that indicates a failed attempt to contact the App Attest service during an attestation. Possible resolutions include:
 *      - implementing exponential backoff for failed attestation requests,
 *      - reduce the possbility of rate-limiting by onboarding users gradually onto App Attest if you have a large user base
 *      - ensure that your users have reliable Internet connectivity with modules like `expo-network` or `react-native-netinfo`
 * - `'FEATURE_UNSUPPORTED'`: An error that indicates that the device does not support App Attest, such as MacOS. This can be mitigated by using `AppIntegrity.isSupported()` (iOS only) to check for App Attest support before calling this function.
 * - `'UNKNOWN_SYSTEM_FAILURE'`: A failure has occurred, such as the failure to generate a token. This is likely analogous to a 500 error on Apple's servers, and should be handled by implementing exponential backoff.
 *
 * `expo-app-integrity` also may throw its own `'UNHANDLED_EXCEPTION'` with the original error message if it does not match any of the above error codes.
 *
 * `DCError` struct documentation: https://developer.apple.com/documentation/devicecheck/dcerror
 *
 * On Android:
 * This function can throw errors that extend the `IntegrityServiceException` class:
 *
 * `IntegrityServiceException` class documentation: https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/IntegrityServiceException
 */
export async function attestKey(
  /**
   * A crytographically random value generated on your server,
   * and associated with your user object for server-side
   * comparison after Apple signs the request
   */
  challenge: string,
  /**
   * Android only (required). The Google Cloud Project Number
   * associated with your app. You can find this by:
   * 1) Going to the Google Developer Console (https://console.developers.google.com),
   * 2) selecting your project in the dropdown on the top left (generally this reads "Google Play Console Developer" for Android apps),
   * 3) selecting the kebab menu at top-right (three vertical dots),
   * 4) and selecting "Project Settings"
   */
  cloudProjectNumber?: number,
): Promise<string | never> {
  switch (Platform.OS) {
    case 'ios':
      return await iOSAttestKey(challenge)
    case 'android':
      if (!cloudProjectNumber)
        throw AndroidIntegrityErrors.CLOUD_PROJECT_NUMBER_IS_INVALID

      return await androidRequestIntegrityVerdict(challenge, cloudProjectNumber)
    default:
      throw PlatformAgnosticErrors.UNSUPPORTED_PLATFORM
  }
}

export async function generateAssertion(
  /** The key identifier assigned in Integrity#generateKey */
  keyIdentifier: string,

  /**
   * A crytographically random value generated on your server,
   * and associated with your user object for server-side
   * comparison after Apple signs the request
   */
  challenge: string,

  /** The request JSON for Apple to sign */
  requestJSON: Record<string | number | symbol, unknown>,
): Promise<string | never> {
  /** Include the server-issued challenge into the requestJSON */
  const withChallenge = { ...requestJSON, challenge }

  const assertionResult = await IntegrityModule.generateAssertion(
    keyIdentifier,
    JSON.stringify(withChallenge),
  )

  return assertionResult
}

export * from './errors'
