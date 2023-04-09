/** Agent to resolve the error, if possible */
export enum ErrorResolutionTypes {
  NON_ACTIONABLE,
  DEVELOPER_ACTION_REQUIRED,
  USER_ACTION_REQUIRED,
}

export type AppIntegrityError = {
  /** A unique (to this package) error code */
  code: string
  /** A unique (to this package) error code that users can use to communicate issues with the developer without divulging the root cause */
  errorCode: number
  /** A link to the documentation pertaining to the error */
  documentation: string
  /** A detailed description of the error */
  detail: string
  /** An error message that can be displayed to users */
  userFriendlyMessage: string
  /** A description of how to resolve the error, if possible  */
  resolution: string
  /** Agent to resolve the error, if possible */
  resolutionType: ErrorResolutionTypes
}

export type UnhandledException = AppIntegrityError & {
  originalMessage: string
}
