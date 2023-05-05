import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.scss'
import OpeningTimesPicker from './lib/OpeningTimesPicker'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <OpeningTimesPicker onBusinessDaysChanged={(days) => console.log(days)} style={{ width: '70%', height: '70px' }} />
  </React.StrictMode>,
)
