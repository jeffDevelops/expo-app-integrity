package expo.modules.integrity

import kotlin.Result
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityServiceException
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.model.IntegrityErrorCode
import expo.modules.kotlin.exception.CodedException

const val UNKNOWN_ERROR_CODE = 26

class IntegrityModule : Module() {

  class IntegrityTokenException(val code: Int, override val message: String) : Exception(message)

  enum class IntegrityTokenError(val code: Int, val message: String) {

    // Non-actionable errors
    APP_NOT_INSTALLED(0, "APP_NOT_INSTALLED"),
    APP_UID_MISMATCH(1, "APP_UID_MISMATCH"),

    // Errors that may require end-user resolution
    API_NOT_AVAILABLE(2,  "API_NOT_AVAILABLE"),
    CANNOT_BIND_TO_SERVICE(3, "CANNOT_BIND_TO_SERVICE"),
    NETWORK_ERROR(4, "NETWORK_ERROR"),
    PLAY_SERVICES_NOT_FOUND(5, "PLAY_SERVICES_NOT_FOUND"),
    PLAY_SERVICES_VERSION_OUTDATED(6,  "PLAY_SERVICES_VERSION_OUTDATED"),
    PLAY_STORE_ACCOUNT_NOT_FOUND(7, "PLAY_STORE_ACCOUNT_NOT_FOUND"),
    PLAY_STORE_NOT_FOUND(8, "PLAY_STORE_NOT_FOUND"),
    PLAY_STORE_VERSION_OUTDATED(9, "PLAY_STORE_VERSION_OUTDATED"),


    // Errors recommending retry with an exponential backoff
    CLIENT_TRANSIENT_ERROR(10, "CLIENT_TRANSIENT_ERROR"),
    GOOGLE_SERVER_UNAVAILABLE(11, "GOOGLE_SERVER_UNAVAILABLE"),
    INTERNAL_ERROR(12, "INTERNAL_ERROR"),

    // Library consumer configuration errors
    CLOUD_PROJECT_NUMBER_IS_INVALID(13, "CLOUD_PROJECT_NUMBER_IS_INVALID"),
    NONCE_IS_NOT_BASE64(14, "NONCE_IS_NOT_BASE64"),
    NONCE_TOO_LONG(15, "NONCE_TOO_LONG"),
    NONCE_TOO_SHORT(16, "NONCE_TOO_SHORT"),
    TOO_MANY_REQUESTS(17, "TOO_MANY_REQUESTS"),

    NO_ERROR(18, "NO_ERROR"),

    // Library-specific errors
    INVALID_INTEGRITY_TOKEN_RESPONSE(19, "INVALID_INTEGRITY_TOKEN_RESPONSE"),
    INVALID_IS_SUPPORTED_API(20, "INVALID_IS_SUPPORTED_API")
  }

  override fun definition() = ModuleDefinition {
    Name("Integrity")

    Function("isSupported") {
      throw IntegrityTokenException(
        IntegrityTokenError.INVALID_IS_SUPPORTED_API.code,
        IntegrityTokenError.INVALID_IS_SUPPORTED_API.message
      )
    }

    AsyncFunction("requestIntegrityVerdict") { challenge: String, cloudProjectNumber: Long, promise: Promise ->
      val integrityManager = IntegrityManagerFactory.create(appContext.reactContext)

      return@AsyncFunction integrityManager.requestIntegrityToken(
        IntegrityTokenRequest.builder()
          .setCloudProjectNumber(cloudProjectNumber)
          .setNonce(challenge)
          .build()
      ).addOnCompleteListener { task ->

        if (task.isSuccessful) {
          val token: String? = task.result?.token()
          val result =
            if (token != null) Result.success(token)
            else Result.failure<IntegrityTokenException>(
              IntegrityTokenException(
                IntegrityTokenError.INVALID_INTEGRITY_TOKEN_RESPONSE.code,
                IntegrityTokenError.INVALID_INTEGRITY_TOKEN_RESPONSE.message
              )
            )

          promise.resolve(token)
          result
        } else {
          println(task.exception)
          val error: Result<IntegrityTokenException> = when (task.exception) {
            is IntegrityServiceException -> {
              // Surface descriptive errors and their possible resolutions
              when ((task.exception as IntegrityServiceException).errorCode) {
                IntegrityErrorCode.API_NOT_AVAILABLE -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.API_NOT_AVAILABLE.code,
                    IntegrityTokenError.API_NOT_AVAILABLE.message
                  )
                )

                IntegrityErrorCode.APP_NOT_INSTALLED -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.APP_NOT_INSTALLED.code,
                    IntegrityTokenError.APP_NOT_INSTALLED.message
                  )
                )

                IntegrityErrorCode.APP_UID_MISMATCH -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.APP_UID_MISMATCH.code,
                    IntegrityTokenError.APP_UID_MISMATCH.message
                  )
                )

                IntegrityErrorCode.CANNOT_BIND_TO_SERVICE -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.CANNOT_BIND_TO_SERVICE.code,
                    IntegrityTokenError.CANNOT_BIND_TO_SERVICE.message
                  )
                )

                IntegrityErrorCode.CLIENT_TRANSIENT_ERROR -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.CLIENT_TRANSIENT_ERROR.code,
                    IntegrityTokenError.CLIENT_TRANSIENT_ERROR.message
                  )
                )

                IntegrityErrorCode.CLOUD_PROJECT_NUMBER_IS_INVALID -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.CLOUD_PROJECT_NUMBER_IS_INVALID.code,
                    IntegrityTokenError.CLOUD_PROJECT_NUMBER_IS_INVALID.message
                  )
                )

                IntegrityErrorCode.GOOGLE_SERVER_UNAVAILABLE -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.GOOGLE_SERVER_UNAVAILABLE.code,
                    IntegrityTokenError.GOOGLE_SERVER_UNAVAILABLE.message
                  )
                )

                IntegrityErrorCode.INTERNAL_ERROR -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.INTERNAL_ERROR.code,
                    IntegrityTokenError.INTERNAL_ERROR.message
                  )
                )

                IntegrityErrorCode.NETWORK_ERROR -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.NETWORK_ERROR.code,
                    IntegrityTokenError.NETWORK_ERROR.message
                  )
                )

                IntegrityErrorCode.NO_ERROR -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.NO_ERROR.code,
                    IntegrityTokenError.NO_ERROR.message
                  )
                )

                IntegrityErrorCode.NONCE_IS_NOT_BASE64 -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.NONCE_IS_NOT_BASE64.code,
                    IntegrityTokenError.NONCE_IS_NOT_BASE64.message
                  )
                )

                IntegrityErrorCode.NONCE_TOO_LONG -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.NONCE_TOO_LONG.code,
                    IntegrityTokenError.NONCE_TOO_LONG.message
                  )
                )

                IntegrityErrorCode.NONCE_TOO_SHORT -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.NONCE_TOO_SHORT.code,
                    IntegrityTokenError.NONCE_TOO_SHORT.message
                  )
                )

                IntegrityErrorCode.PLAY_SERVICES_NOT_FOUND -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.PLAY_SERVICES_NOT_FOUND.code,
                    IntegrityTokenError.PLAY_SERVICES_NOT_FOUND.message
                  )
                )

                IntegrityErrorCode.PLAY_SERVICES_VERSION_OUTDATED -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.PLAY_SERVICES_VERSION_OUTDATED.code,
                    IntegrityTokenError.PLAY_SERVICES_VERSION_OUTDATED.message
                  )
                )

                IntegrityErrorCode.PLAY_STORE_NOT_FOUND -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.PLAY_STORE_NOT_FOUND.code,
                    IntegrityTokenError.PLAY_STORE_NOT_FOUND.message
                  )
                )

                IntegrityErrorCode.PLAY_STORE_ACCOUNT_NOT_FOUND -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.PLAY_STORE_ACCOUNT_NOT_FOUND.code,
                    IntegrityTokenError.PLAY_STORE_ACCOUNT_NOT_FOUND.message
                  )
                )

                IntegrityErrorCode.PLAY_STORE_VERSION_OUTDATED -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.PLAY_STORE_VERSION_OUTDATED.code,
                    IntegrityTokenError.PLAY_STORE_VERSION_OUTDATED.message
                  )
                )

                IntegrityErrorCode.TOO_MANY_REQUESTS -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    IntegrityTokenError.TOO_MANY_REQUESTS.code,
                    IntegrityTokenError.TOO_MANY_REQUESTS.message
                  )
                )

                else -> Result.failure<IntegrityTokenException>(
                  IntegrityTokenException(
                    UNKNOWN_ERROR_CODE,
                    "An unknown error occurred. Original error: " + (task.exception?.message ?: "Unable to retrieve original error message")
                  )
                )
              }
            }

            else -> Result.failure<IntegrityTokenException>(
              IntegrityTokenException(
                UNKNOWN_ERROR_CODE,
                "An unknown error occurred. Original error: " + (task.exception?.message ?: "Unable to retrieve original error message")
              )
            )
          }

          val codedException: CodedException = CodedException(error.toString())
          promise.reject(codedException)
          error
        }
      }
    }
  }
}
