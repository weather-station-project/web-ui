import { BatchSpanProcessor, ConsoleSpanExporter, SpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { GlobalConfig } from './config/config.ts'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

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
  }),
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

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new UserInteractionInstrumentation(), new XMLHttpRequestInstrumentation(), new DocumentLoadInstrumentation()],
})

/*export const otelSDK = new NodeSDK({
  spanProcessors: getProcessors(),
  metricReader: getMetricReader(),
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: GlobalConfig.otlp.attrs.serviceName,
    [ATTR_SERVICE_VERSION]: GlobalConfig.otlp.attrs.serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: GlobalConfig.otlp.attrs.deploymentEnvironment,
  }),
  instrumentations: [new SocketIoInstrumentation(), new NestInstrumentation(), new PinoInstrumentation()],
})

function getProcessors(): SpanProcessor[] {
  return [
    new BatchSpanProcessor(
      GlobalConfig.otlp.debugInConsole
        ? new ConsoleSpanExporter()
        : new OTLPTraceExporter({
            url: `${GlobalConfig.otlp.rootUrl}/v1/traces`,
            headers: {},
          })
    ),
  ]
}

function getMetricReader(): IMetricReader {
  return new PeriodicExportingMetricReader({
    exporter: GlobalConfig.otlp.debugInConsole
      ? new ConsoleMetricExporter()
      : new OTLPMetricExporter({
          url: `${GlobalConfig.otlp.rootUrl}/v1/metrics`,
        }),
  })
}

let hostMetricsSDK: HostMetrics | undefined
export function getHostMetricsSDK(): HostMetrics {
  if (hostMetricsSDK) {
    return hostMetricsSDK
  }

  hostMetricsSDK = new HostMetrics({
    meterProvider: metrics.getMeterProvider(),
  })
  return hostMetricsSDK
}

function shutdownSDK(): void {
  otelSDK
    .shutdown()
    .then(() => {
      console.log('OpenTelemetry SDK shutdown successfully.')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error shutting down OpenTelemetry SDK: ', error)
      process.exit(1)
    })
}

process.on('SIGTERM', (): void => shutdownSDK())
process.on('SIGINT', (): void => shutdownSDK())*/
