import React from 'react';
import ReactDOM from 'react-dom/client';
import SidePanel from './SidePanel';
import { AuthWall } from '../shared/AuthWall';
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthWall>
      <SidePanel />
    </AuthWall>
  </React.StrictMode>
);
