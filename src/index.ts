import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

import IntegrityModule from './IntegrityModule'
import { SECURE_STORAGE_KEYS } from './config'

/** @description iOS Only. */
export function isSupported(): boolean {
  return IntegrityModule.isSupported()
}

/** iOS Only */
const generateKey = async (): Promise<string | never> => {
  return await IntegrityModule.generateKey()
}

const iOSAttestKey = async (challenge: string): Promise<string | never> => {
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
    throw error
  }
}

const androidRequestIntegrityVerdict = async (
  challenge: string,
): Promise<string | never> =>
  await IntegrityModule.requestIntegrityVerdict(challenge)

export async function attestKey(challenge: string): Promise<string | never> {
  switch (Platform.OS) {
    case 'ios':
      return await iOSAttestKey(challenge)
    case 'android':
      return await androidRequestIntegrityVerdict(challenge)
    default:
      throw new Error(
        'Unsupported platform. Supported platforms are iOS and Android.',
      )
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
