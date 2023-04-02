package expo.modules.integrity

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityServiceException
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.model.IntegrityErrorCode

class IntegrityModule(private val applicationContext: Context) : Module() {

  class IntegrityTokenException(override val message: String) : Exception(message)

  enum class IntegrityTokenError(val message: String) {

    // Non-actionable errors
    APP_NOT_INSTALLED("The calling app is not installed. Something is wrong (possibly an attack). Non-actionable.\n" +
            "See: https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#APP_NOT_INSTALLED"
    ),
    APP_UID_MISMATCH("The calling app UID (user id) does not match the one from Package Manager.\n" +
            "Something is wrong (possibly an attack). Non-actionable.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#APP_UID_MISMATCH"
    ),

    // Errors that may require end-user resolution
    API_NOT_AVAILABLE("Integrity API is not available. Integrity API is not enabled, or the Play Store version might be old. Recommended actions:\n" +
            "- Make sure that Integrity API is enabled in Google Play Console for your application.\n" +
            "- Ask the user to update Play Store.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#API_NOT_AVAILABLE"
    ),
    CANNOT_BIND_TO_SERVICE("Binding to the service in the Play Store has failed. This can be due to having an old Play Store version installed on the device. Recommended actions:\n" +
            "- Ask the user to update Play Store.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CANNOT_BIND_TO_SERVICE"
    ),
    NETWORK_ERROR("No available network is found.\n" +
            "Ask the user to check for a connection.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NETWORK_ERROR"
    ),
    PLAY_SERVICES_NOT_FOUND("Play Services is not available or version is too old.\n" +
            "Ask the user to Install or Update Play Services.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_SERVICES_NOT_FOUND"
    ),
    PLAY_SERVICES_VERSION_OUTDATED("Play Services needs to be updated.\n" +
            "Ask the user to update Google Play Services.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_SERVICES_VERSION_OUTDATED"
    ),
    PLAY_STORE_ACCOUNT_NOT_FOUND("No Play Store account is found on device. Note that the Play Integrity API now supports unauthenticated requests. This error code is used only for older Play Store versions that lack support.\n" +
            "Ask the user to authenticate in Play Store.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_ACCOUNT_NOT_FOUND"
    ),
    PLAY_STORE_NOT_FOUND("No Play Store app is found on device or not official version is installed.\n" +
            "Ask the user to install an official and recent version of Play Store.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_NOT_FOUND"
    ),
    PLAY_STORE_VERSION_OUTDATED("The Play Store needs to be updated.\n" +
            "Ask the user to update the Google Play Store.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#PLAY_STORE_VERSION_OUTDATED"
    ),


    // Errors recommending retry with an exponential backoff
    CLIENT_TRANSIENT_ERROR("There was a transient error in the client device.\n" +
            "Retry with an exponential backoff.\n" +
            "Introduced in Integrity Play Core version 1.1.0 (prior versions returned a token with empty Device Integrity Verdict). If the error persists after a few retries, you should assume that the device has failed integrity checks and act accordingly.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CLIENT_TRANSIENT_ERROR"
    ),
    GOOGLE_SERVER_UNAVAILABLE("Unknown internal Google server error.\n" +
            "Retry with an exponential backoff. Consider filing a bug if fails consistently.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#GOOGLE_SERVER_UNAVAILABLE"
    ),
    INTERNAL_ERROR("Unknown internal error.\n" +
            "Retry with an exponential backoff. Consider filing a bug if fails consistently.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#INTERNAL_ERROR"
    ),

    // Library consumer configuration errors
    CLOUD_PROJECT_NUMBER_IS_INVALID("The provided cloud project number is invalid.\n" +
            "Use the cloud project number which can be found in Project info in your Google Cloud Console for the cloud project where Play Integrity API is enabled.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#CLOUD_PROJECT_NUMBER_IS_INVALID"
    ),
    NONCE_IS_NOT_BASE64("Nonce is not encoded as a base64 web-safe no-wrap string.\n" +
            "Retry with correct nonce format.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_IS_NOT_BASE64"
    ),
    NONCE_TOO_LONG("Nonce length is too long. The nonce must be less than 500 bytes before base64 encoding.\n" +
            "Retry with a shorter nonce.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_TOO_LONG"
    ),
    NONCE_TOO_SHORT("Nonce length is too short. The nonce must be a minimum of 16 bytes (before base64 encoding) to allow for a better security.\n" +
            "Retry with a longer nonce.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NONCE_TOO_LONG"
    ),
    TOO_MANY_REQUESTS("The calling app is making too many requests to the API and hence is throttled.\n" +
            "Retry with an exponential backoff.\n" +
            "See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#TOO_MANY_REQUESTS"
    ),

    NO_ERROR("See https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/IntegrityErrorCode.html#NO_ERROR"),

    INVALID_TOKEN_RESPONSE("Google Play Integrity API did not return an error, but the integrity token was null"),
    OTHER("Unknown error occurred");
  }

  override fun definition() = ModuleDefinition {
    Name("Integrity")

    Function("isSupported") { Boolean
      return@Function true
    }

    AsyncFunction("requestIntegrityVerdict") { challenge: String ->
      val integrityManager = IntegrityManagerFactory.create(applicationContext)

      integrityManager.requestIntegrityToken(
        IntegrityTokenRequest.builder()
          .setNonce(challenge)
          .build()
      ).addOnCompleteListener { task ->
        if (task.isSuccessful) {
          val token: String? = task.result?.token()
          val result =
            if (token != null) Result.success(token)
            else Result.failure<IntegrityTokenException>(IntegrityTokenException(IntegrityTokenError.INVALID_TOKEN_RESPONSE.message))

          result
        } else {
          val error = when (task.exception) {
            is IntegrityServiceException -> {
              // Surface descriptive errors and their possible resolutions
              when ((task.exception as IntegrityServiceException).errorCode) {
                IntegrityErrorCode.API_NOT_AVAILABLE -> IntegrityTokenError.API_NOT_AVAILABLE
                IntegrityErrorCode.APP_NOT_INSTALLED -> IntegrityTokenError.APP_NOT_INSTALLED
                IntegrityErrorCode.APP_UID_MISMATCH -> IntegrityTokenError.APP_UID_MISMATCH
                IntegrityErrorCode.CANNOT_BIND_TO_SERVICE -> IntegrityTokenError.CANNOT_BIND_TO_SERVICE
                IntegrityErrorCode.CLIENT_TRANSIENT_ERROR -> IntegrityTokenError.CLIENT_TRANSIENT_ERROR
                IntegrityErrorCode.CLOUD_PROJECT_NUMBER_IS_INVALID -> IntegrityTokenError.CLOUD_PROJECT_NUMBER_IS_INVALID
                IntegrityErrorCode.GOOGLE_SERVER_UNAVAILABLE -> IntegrityTokenError.GOOGLE_SERVER_UNAVAILABLE
                IntegrityErrorCode.INTERNAL_ERROR -> IntegrityTokenError.INTERNAL_ERROR
                IntegrityErrorCode.NETWORK_ERROR -> IntegrityTokenError.NETWORK_ERROR
                IntegrityErrorCode.NO_ERROR -> IntegrityTokenError.NO_ERROR
                IntegrityErrorCode.NONCE_IS_NOT_BASE64 -> IntegrityTokenError.NONCE_IS_NOT_BASE64
                IntegrityErrorCode.NONCE_TOO_LONG -> IntegrityTokenError.NONCE_TOO_LONG
                IntegrityErrorCode.NONCE_TOO_SHORT -> IntegrityTokenError.NONCE_TOO_SHORT
                IntegrityErrorCode.PLAY_SERVICES_NOT_FOUND -> IntegrityTokenError.PLAY_SERVICES_NOT_FOUND
                IntegrityErrorCode.PLAY_SERVICES_VERSION_OUTDATED -> IntegrityTokenError.PLAY_SERVICES_VERSION_OUTDATED
                IntegrityErrorCode.PLAY_STORE_NOT_FOUND -> IntegrityTokenError.PLAY_STORE_NOT_FOUND
                IntegrityErrorCode.PLAY_STORE_ACCOUNT_NOT_FOUND -> IntegrityTokenError.PLAY_STORE_ACCOUNT_NOT_FOUND
                IntegrityErrorCode.PLAY_STORE_VERSION_OUTDATED -> IntegrityTokenError.PLAY_STORE_VERSION_OUTDATED
                IntegrityErrorCode.TOO_MANY_REQUESTS -> IntegrityTokenError.TOO_MANY_REQUESTS
                else -> Result.failure<IntegrityTokenException>(IntegrityTokenException(IntegrityTokenError.OTHER.message))
              }
            }
            else -> Result.failure<IntegrityTokenException>(IntegrityTokenException(IntegrityTokenError.OTHER.message))
          }

          error
        }
      }
    }
  }
}
