import CryptoKit
import DeviceCheck
import ExpoModulesCore

@available(iOS 14.0, *)
public class IntegrityModule: Module {

    private let service: DCAppAttestService = DCAppAttestService.shared
    
    enum DeviceCheckError {
        case invalidKey,
             invalidInput,
             serverUnavailable,
             featureUnsupported,
             unknownSystemFailure,
             unhandledException(localizedDescription: String)
        
        var description : String {
            switch self {
            case .invalidKey: return "INVALID_KEY"
            case .invalidInput: return "INVALID_INPUT"
            case .serverUnavailable: return "SERVER_UNAVAILABLE"
            case .featureUnsupported: return "FEATURE_UNSUPPORTED"
            case .unknownSystemFailure: return "UNKNOWN_SYSTEM_FAILURE"
            case .unhandledException(let localizedDescription):
                return "An unknown error not enumerated by DCError occurred, and as a result, likely has nothing to do with DeviceCheck or AppAttest. Original error: \(localizedDescription)"
            }
          }
    }
    
    private class IntegrityModuleException: GenericException<OSStatus> {
        private var appAttestError: DeviceCheckError
        
        init(appAttestError: DeviceCheckError) {
            self.appAttestError = appAttestError
            super.init(OSStatus())
        }
        
        override var reason: String {
            self.appAttestError.description
        }
    }

    
    enum AppAttestRequestResult {
        case success(result: String),
             error(error: DeviceCheckError)
    }
    
    enum AppAttestSuccessResult {
        case assertion(data: Data?),
             attestation(data: Data?),
             keyIdentifier(string: String?)
    }
    
    private func handleDeviceCheckError(
        error: DCError,
        continuation: CheckedContinuation<IntegrityModule.AppAttestRequestResult, Never>
    ) -> Void {
        switch (error.code) {
        case .invalidKey: return continuation.resume(returning: AppAttestRequestResult.error(error: .invalidKey))
        case .invalidInput: return continuation.resume(returning: AppAttestRequestResult.error(error: .invalidInput))
        case .serverUnavailable: return continuation.resume(returning: AppAttestRequestResult.error(error: .serverUnavailable))
        case .featureUnsupported: return continuation.resume(returning: AppAttestRequestResult.error(error: .featureUnsupported))
        case .unknownSystemFailure: return continuation.resume(returning: AppAttestRequestResult.error(error: .unknownSystemFailure))
        default: return continuation.resume(returning: AppAttestRequestResult.error(error: .unhandledException(localizedDescription: error.localizedDescription)))
        }
    }
    
    private func appAttestCompletion(
        result: AppAttestSuccessResult,
        error: (any Error)?,
        continuation: CheckedContinuation<IntegrityModule.AppAttestRequestResult, Never>
    ) -> Void {

        if let error = error as? DCError {
            return self.handleDeviceCheckError(error: error, continuation: continuation)
        } else if error != nil {
            return continuation.resume(
                returning: AppAttestRequestResult.error(
                    error: .unhandledException(
                        localizedDescription: error?.localizedDescription ?? "Localized description not included in error"
                    )
                )
            )
        }
                    
        switch (result) {
        case .attestation(let data):
            guard let data = data else {
                return continuation.resume(
                    returning: AppAttestRequestResult.error(
                        error: DeviceCheckError.unhandledException(
                            localizedDescription: "AppAttest did not throw an error, but the attestation was nil."
                        )
                    )
                )
            }
            
            return continuation.resume(returning: .success(result: String(decoding: data, as: UTF8.self)))
            
        case .keyIdentifier(let string):
            guard let string = string else {
                return continuation.resume(
                    returning: AppAttestRequestResult.error(
                        error: DeviceCheckError.unhandledException(
                            localizedDescription: "AppAttest did not throw an error, but the key identifier was nil."
                        )
                    )
                )
            }
            
            return continuation.resume(returning: .success(result: string))
            
        case .assertion(let data):
            
            guard let data = data else {
                return continuation.resume(
                    returning: AppAttestRequestResult.error(
                        error: DeviceCheckError.unhandledException(
                            localizedDescription: "AppAttest did not throw an error, but the assertion was nil."
                        )
                    )
                )
            }
            
            return continuation.resume(returning: .success(result: String(decoding: data, as: UTF8.self)))
        }

    }
    
    public func definition() -> ModuleDefinition {
        Name("Integrity")
      
        Function("isSupported") { () -> Bool in
            service.isSupported
        }

        AsyncFunction("generateKey") { () async throws -> String in
            
            
            let result = await withCheckedContinuation { continuation in
                service.generateKey { result, error in
                    
                    return self.appAttestCompletion(
                        result: AppAttestSuccessResult.keyIdentifier(string: result),
                        error: error,
                        continuation: continuation
                    )
                }
            }
            
            switch (result) {
            case .error(let error): throw IntegrityModuleException(appAttestError: error)
            case .success(let result): return result
            }
        }
      
        AsyncFunction("attestKey") { (
            keyIdentifier: String,
            challenge: String
        ) async throws -> String in
            let hash = Data(SHA256.hash(data: Data(challenge.utf8)))
            let result = await withCheckedContinuation { continuation in
                service.attestKey(keyIdentifier, clientDataHash: hash) { result, error in
                    return self.appAttestCompletion(
                        result: AppAttestSuccessResult.attestation(data: result),
                        error: error,
                        continuation: continuation
                    )
                }
            }
                        
            switch (result) {
            case .error(let error): throw IntegrityModuleException(appAttestError: error)
            case .success(let result): return result
            }
            
        }
        
        AsyncFunction("generateAssertion") { (
            keyIdentifier: String,
            requestJSON: String
        ) async throws -> String in
            let hash = Data(SHA256.hash(data: Data(requestJSON.utf8)))
            let result = await withCheckedContinuation { continuation in
                service.generateAssertion(keyIdentifier, clientDataHash: hash) { result, error in
                    return self.appAttestCompletion(
                        result: AppAttestSuccessResult.assertion(data: result),
                        error: error,
                        continuation: continuation
                    )
                }
            }
            
            switch (result) {
            case .error(let error): throw IntegrityModuleException(appAttestError: error)
            case .success(let result): return result
            }
        }
        
    }
}
