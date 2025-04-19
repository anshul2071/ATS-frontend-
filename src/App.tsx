import React from 'react';
import LayoutComponent from './components/Layout';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => (
  <LayoutComponent>
    <AppRoutes />
  </LayoutComponent>
);

export default App;
