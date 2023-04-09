import { type AppIntegrityError, ErrorResolutionTypes } from './types'

export const unhandledException = (
  originalMessage: string,
): AppIntegrityError & { originalMessage: string } => ({
  originalMessage,
  code: 'UNKNOWN',
  errorCode: 26,
  documentation: 'https://gihub.com/jeffDevelops/expo-app-integrity',
  detail: `An unknown error occurred. See \`originalMessage\` for more information.`,
  userFriendlyMessage:
    'App integrity verification failed. An unknown error occurred. Error code: 26',
  resolution:
    'Retry with an exponential backoff. Consider filing an issue with the `expo-app-integrity` repository.',
  resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
})

export const PlatformAgnosticErrors = {
  UNSUPPORTED_PLATFORM: {
    code: 'UNSUPPORTED_PLATFORM',
    errorCode: 27,
    documentation: 'https://gihub.com/jeffDevelops/expo-app-integrity',
    detail: `The current platform is not supported by this library. Only 'ios' and 'android' are supported.`,
    userFriendlyMessage: 'App integrity verification failed.',
    resolution: 'Use this library only on iOS and Android.',
    resolutionType: ErrorResolutionTypes.DEVELOPER_ACTION_REQUIRED,
  },
}
