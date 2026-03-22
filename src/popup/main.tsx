import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';
import { AuthWall } from '../shared/AuthWall';
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthWall>
      <Popup />
    </AuthWall>
  </React.StrictMode>
);
