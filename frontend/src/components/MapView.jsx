import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'

// Fix default marker icon for Vite/webpack builds
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const RISK_COLORS = {
  Low: '#22c55e',
  Moderate: '#f59e0b',
  High: '#ef4444',
}

export default function MapView({ sites = [], selectedSite, onSiteClick }) {
  const center = [22.5, 82.0]

  return (
    <div className="glass-card overflow-hidden" style={{ height: 420 }}>
      <MapContainer center={center} zoom={5} className="w-full h-full" scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {sites.map((site) => {
          const riskColor = site.latest?.flood_risk > 0.7 ? RISK_COLORS.High
            : site.latest?.flood_risk > 0.4 ? RISK_COLORS.Moderate
            : RISK_COLORS.Low
          const isSelected = selectedSite === site.id
          return (
            <CircleMarker
              key={site.id}
              center={[site.latitude, site.longitude]}
              radius={isSelected ? 14 : 10}
              pathOptions={{
                color: isSelected ? '#0ea5e9' : riskColor,
                fillColor: isSelected ? '#0ea5e9' : riskColor,
                fillOpacity: 0.75,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{ click: () => onSiteClick && onSiteClick(site.id) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h4 className="font-semibold text-sm text-slate-800 mb-1">{site.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{site.location} · {site.river}</p>
                  {site.latest && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Discharge</span>
                        <span className="font-medium">{Number(site.latest.discharge).toFixed(0)} m³/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Turbidity</span>
                        <span className="font-medium">{Number(site.latest.turbidity).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Area</span>
                        <span className="font-medium">{Number(site.latest.water_area).toFixed(0)} ha</span>
                      </div>
                    </div>
                  )}
                  <div
                    className="mt-2 text-xs font-semibold text-center py-1 rounded"
                    style={{ background: riskColor + '22', color: riskColor }}
                  >
                    {site.latest?.flood_risk > 0.7 ? '🔴 High Risk' : site.latest?.flood_risk > 0.4 ? '🟡 Moderate' : '🟢 Low Risk'}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
