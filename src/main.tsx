import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import './styles/index.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './helpers/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import log from './config/logging'
import { Logger } from 'loglevel'
import Loading from './components/generic/Loading.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.tsx'
import Layout from './components/generic/Layout.tsx'

const localLog: Logger = log.getLogger('main')
localLog.debug('Starting application')

// https://github.com/weather-station-project/dashboard/tree/master/Code/src/WeatherStationProject.Dashboard.App/ClientApp
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={new QueryClient()}></QueryClientProvider>
      <Suspense fallback={<Loading />}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              {/*<Route path="/historicaldata" element={<HistoricalData showChartViewAndGrouping={true} />} />
        <Route path="/measurementslist" element={<HistoricalData showChartViewAndGrouping={false} />} />*/}
            </Routes>
          </Layout>
        </BrowserRouter>
      </Suspense>
    </I18nextProvider>
  </StrictMode>
)
