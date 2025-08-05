import { BatchSpanProcessor, ConsoleSpanExporter, SpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { GlobalConfig } from './config/config.ts'
import { detectResources, resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { browserDetector } from '@opentelemetry/opentelemetry-browser-detector'

/*
Useful links:
  https://opentelemetry.io/docs/languages/js/getting-started/browser/
  https://opentelemetry.io/docs/concepts/semantic-conventions/
*/
const provider = new WebTracerProvider({
  spanProcessors: getProcessors(),
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: GlobalConfig.otlp.attrs.serviceName,
    [ATTR_SERVICE_VERSION]: GlobalConfig.otlp.attrs.serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: GlobalConfig.otlp.attrs.deploymentEnvironment,
  }).merge(detectResources({ detectors: [browserDetector] })),
})

provider.register({
  contextManager: new ZoneContextManager(),
})

function getProcessors(): SpanProcessor[] {
  return [
    new BatchSpanProcessor(
      GlobalConfig.otlp.debugInConsole
        ? new ConsoleSpanExporter()
        : new OTLPTraceExporter({
            url: `${GlobalConfig.otlp.rootUrl}/v1/traces`,
          })
    ),
  ]
}

registerInstrumentations({
  instrumentations: [new UserInteractionInstrumentation(), new XMLHttpRequestInstrumentation(), new DocumentLoadInstrumentation()],
})
