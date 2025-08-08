sessionStorage.clear()

sessionStorage.setItem('OTEL_EXPORTER_OTLP_ENDPOINT', '${OTEL_EXPORTER_OTLP_ENDPOINT}')
sessionStorage.setItem('OTEL_FAKE_ENDPOINT', '${OTEL_FAKE_ENDPOINT}') // This URL is used to send data locally, it will be redirected through the nginx proxy
sessionStorage.setItem('OTEL_DEBUG_IN_CONSOLE', '${OTEL_DEBUG_IN_CONSOLE}')
sessionStorage.setItem('OTEL_SERVICE_VERSION', '${OTEL_SERVICE_VERSION}')
sessionStorage.setItem('OTEL_DEPLOYMENT_ENVIRONMENT', '${OTEL_DEPLOYMENT_ENVIRONMENT}')
