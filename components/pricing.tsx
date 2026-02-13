"use client"

import React from 'react'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ScatterController,
  Filler
} from 'chart.js'
import { Bar, Doughnut, Scatter } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ScatterController,
  Filler
)

export default function Pricing() {

  // --- Helper: Label Wrapping ---
  const wrapLabels = (labels: string[]) => {
    return labels.map((label) => {
      if (label.length > 16) {
        const words = label.split(' ')
        const lines: string[] = []
        let currentLine = words[0]
        for (let i = 1; i < words.length; i++) {
          if ((currentLine + ' ' + words[i]).length <= 16) {
            currentLine += ' ' + words[i]
          } else {
            lines.push(currentLine)
            currentLine = words[i]
          }
        }
        lines.push(currentLine)
        // join lines with newline so Chart.js renders multi-line labels
        return lines.join('\n')
      }
      return label
    })
  }

  // --- Gemini API Logic ---
  // Asesor IA eliminado; las llamadas a la API relacionadas fueron removidas.

  // --- Chart Data Configurations ---
  const commonTooltip = {
    callbacks: {
      title: (tooltipItems: any) => {
        const item = tooltipItems[0]
        const label = item.chart.data.labels[item.dataIndex]
        return typeof label === 'string' ? label.replace(/\\n/g, ' ') : String(label)
      }
    }
  }

  const qualityData = {
    labels: wrapLabels(['Limpieza y Recodificación', 'Análisis Estadístico Formal', 'Interpretación y Redacción']),
    datasets: [{
      data: [40, 35, 25],
      backgroundColor: ['#4B0082', '#50C878', '#A29BFE'],
      borderWidth: 0
    }]
  }

  const pricingData = {
    labels: wrapLabels(['Plan Semilla', 'Plan Tesis', 'Plan Investigador', 'Plan Elite']),
    datasets: [{
      label: 'Soles (S/.)',
      data: [200, 560, 960, 1260],
      backgroundColor: ['#E0E0E0', '#50C878', '#4B0082', '#2D3436'],
      borderRadius: 6
    }]
  }

  const rocData = {
    datasets: [
      {
        label: 'Modelo MedSkillz (AUC = 0.89)',
        data: [{x: 0, y: 0}, {x: 0.1, y: 0.45}, {x: 0.2, y: 0.75}, {x: 0.4, y: 0.9}, {x: 1, y: 1}],
        showLine: true,
        borderColor: '#4B0082',
        backgroundColor: 'rgba(75, 0, 130, 0.05)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Azar',
        data: [{x: 0, y: 0}, {x: 1, y: 1}],
        showLine: true,
        borderColor: '#B0B0B0',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans text-[#2D3436]">
      {/* Hero Section */}
      <section className="bg-[#4B0082] text-white pt-24 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-montserrat">Tarifario de Consultoría Estadística</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Análisis estadísticos reproducibles con RStudio para estudiantes universitarios
          </p>
          <div className="flex justify-center gap-4">
            <a href="#planes" className="bg-[#50C878] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-opacity-90 transition">
              Ver Planes
            </a>
            <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="bg-white text-[#4B0082] px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition">
              💬 Contacto (WhatsApp)
            </a>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#50C878] opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </section>

      <main className="container mx-auto px-6 -mt-16 relative z-20 space-y-24">
        
        {/* Intro Section */}
        <section className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#4B0082] mb-4 font-montserrat">¿Por qué profesionalizar tu análisis?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                El éxito de una tesis radica en la calidad de la base de datos. Nuestro enfoque garantiza que tu investigación no sea observada por fallas metodológicas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#50C878] mr-2 text-xl">✅</span>
                  <span>Estandarización profesional de instrumentos.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#50C878] mr-2 text-xl">✅</span>
                  <span>Análisis 100% reproducible en RStudio.</span>
                </li>
              </ul>
            </div>
            <div className="h-80 w-full max-w-md mx-auto">
              <h3 className="text-center font-semibold text-gray-700 mb-4">Esfuerzo en Calidad de Datos</h3>
              <Doughnut 
                data={qualityData} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { 
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, usePointStyle: true } },
                    tooltip: commonTooltip
                  },
                  cutout: '70%'
                }} 
              />
            </div>
          </div>
        </section>

        {/* (Asesor IA removido) */}

        {/* Planes Section */}
        <section id="planes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-xl shadow-md p-6 h-[450px]">
              <h3 className="text-xl font-bold text-center mb-6 text-[#4B0082]">Inversión Sugerida (S/.)</h3>
              <Bar 
                data={pricingData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 12 } }, tooltip: commonTooltip },
                  scales: { y: { beginAtZero: true } },
                  layout: { padding: { top: 8, bottom: 12 } }
                }} 
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <PlanCard title="🌱 Plan Semilla" price="S/ 200" desc="Limpieza de datos." color="gray" />
              <PlanCard title="🎓 Plan Tesis" price="S/ 560" desc="Estándar" color="green" bestSeller />
              <PlanCard title="🔬 Plan Investigador" price="S/ 960" desc="Análisis avanzado y asociación." color="purple" />
              <PlanCard title="🏆 Plan Elite" price="S/ 1,260+" desc="Validación y multivariado." color="black" />
            </div>
          </div>

          {/* Visual Tarifario: barras verticales */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-[#4B0082] mb-6">📋 Tarifario Estándar de Consultoría Estadística (Pregrado/Posgrado)</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Plan 1 */}
              <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-3 bg-gradient-to-b from-gray-300 to-gray-400" />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">🌱 Limpieza de datos</h4>
                      <p className="text-sm text-gray-500">El "Data Cleaning" esencial</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Inversión</div>
                      <div className="text-xl font-extrabold text-gray-800">S/ 200</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>• Traslado de datos a R</li>
                    <li>• Limpieza de duplicados</li>
                    <li>• Manejo de datos perdidos (NA)</li>
                    <li>• Recodificación de escalas (Likert → categorías)</li>
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-semibold">Pedir Cotización</a>
                    <span className="text-xs text-gray-400">Desde</span>
                  </div>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-3 bg-gradient-to-b from-green-400 to-green-600" />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">🎓 Paquete Tesis Básica</h4>
                      <p className="text-sm text-gray-500">Descriptivo + Bivariado</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Inversión</div>
                      <div className="text-xl font-extrabold text-gray-800">S/ 560</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>• Pruebas de Normalidad (Shapiro-Wilk/KS)</li>
                    <li>• Tabla 1: Descripción sociodemográfica</li>
                    <li>• Tabla 2: Cruce de variables (Chi2, Fisher, t-test/U)</li>
                    <li>• Tablas formato Vancouver/APA</li>
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="bg-[#4B0082] text-white px-4 py-2 rounded-lg font-semibold">Solicitar</a>
                    <span className="text-xs text-gray-400">Incluye tablas</span>
                  </div>
                </div>
              </div>

              {/* Plan 3 */}
              <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-3 bg-gradient-to-b from-purple-400 to-purple-700" />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">🔬 Investigación Avanzada</h4>
                      <p className="text-sm text-gray-500">Asociación + Medidas de riesgo</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Inversión</div>
                      <div className="text-xl font-extrabold text-gray-800">S/960</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>• Todo lo del paquete básico</li>
                    <li>• OR / PR (medidas de asociación)</li>
                    <li>• Regresión simple y IC</li>
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="bg-[#6D28D9] text-white px-4 py-2 rounded-lg font-semibold">Cotizar</a>
                    <span className="text-xs text-gray-400">Ideal para publicación</span>
                  </div>
                </div>
              </div>

              {/* Plan 4 */}
              <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="w-3 bg-gradient-to-b from-gray-700 to-black" />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">🏆 Paquete Especializado</h4>
                      <p className="text-sm text-gray-500">Diagnóstico o Multivariado</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Inversión</div>
                      <div className="text-xl font-extrabold text-gray-800">S/1260 +</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>• Valores diagnósticos: sensibilidad/especificidad</li>
                    <li>• Curvas ROC y corte óptimo</li>
                    <li>• Regresión logística múltiple</li>
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="bg-[#2D3436] text-white px-4 py-2 rounded-lg font-semibold">Solicitar</a>
                    <span className="text-xs text-gray-400">Para residentado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROC Curve Section */}
        <section className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#4B0082] mb-4 font-montserrat">Especialistas en Validación</h2>
              <p className="text-gray-600 mb-6">
                Para tesis de residentado y especialidad, implementamos curvas ROC y modelos de ajuste multivariado.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p>✅ Área bajo la curva (AUC)</p>
                <p>✅ Sensibilidad y Especificidad</p>
                <p>✅ Índice de Youden</p>
              </div>
            </div>
            <div className="h-80">
              <Scatter 
                data={rocData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } }
                }} 
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function PlanCard({ title, price, desc, color, bestSeller = false }: any) {
  const borderCol = color === 'green' ? 'border-[#50C878]' : color === 'purple' ? 'border-[#4B0082]' : 'border-gray-300'
  return (
    <div className={`bg-gradient-to-r from-white/80 to-white p-6 rounded-2xl border-l-4 ${borderCol} shadow-lg relative transform hover:-translate-y-1 transition`}> 
      {bestSeller && (
        <div className="absolute -top-3 right-4 bg-[#50C878] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">MÁS SOLICITADO</div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
          <p className="text-sm text-gray-500 mb-4">{desc}</p>
          <a href="https://wa.me/51999913119" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1ebe56]">Contactar</a>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Inversión</span>
          <span className="text-2xl font-extrabold text-[#4B0082]">{price}</span>
        </div>
      </div>
    </div>
  )
}