import { BatchSpanProcessor, ConsoleSpanExporter, SpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { GlobalConfig } from './config/config.ts'
import { detectResources, Resource, resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { browserDetector } from '@opentelemetry/opentelemetry-browser-detector'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { Logger, logs, SeverityNumber } from '@opentelemetry/api-logs'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'

/*
Useful links:
  https://opentelemetry.io/docs/languages/js/getting-started/browser/
  https://opentelemetry.io/docs/concepts/semantic-conventions/
  https://www.elastic.co/observability-labs/blog/web-frontend-instrumentation-with-opentelemetry
*/

// Enable OpenTelemetry debug logging to the console
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

const resources: Resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: GlobalConfig.otlp.attrs.serviceName,
  [ATTR_SERVICE_VERSION]: GlobalConfig.otlp.attrs.serviceVersion,
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: GlobalConfig.otlp.attrs.deploymentEnvironment,
}).merge(detectResources({ detectors: [browserDetector] }))

// Configure logging to send to the collector via nginx
const logExporter = new OTLPLogExporter({
  url: `${GlobalConfig.otlp.rootUrl}/v1/logs`,
})

const loggerProvider = new LoggerProvider({
  resource: resources,
  processors: [new BatchLogRecordProcessor(logExporter)],
})

if (!GlobalConfig.otlp.debugInConsole) {
  logs.setGlobalLoggerProvider(loggerProvider)
}

const logger: Logger = logs.getLogger('instrumentation', GlobalConfig.otlp.attrs.serviceVersion)
logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'INFO',
  body: 'OTLP Logger initialized',
})

const provider = new WebTracerProvider({
  spanProcessors: getProcessors(),
  resource: resources,
})

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new CompositePropagator({
    propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
  }),
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
  instrumentations: [new UserInteractionInstrumentation(), new XMLHttpRequestInstrumentation(), new DocumentLoadInstrumentation(), new FetchInstrumentation()],
})
