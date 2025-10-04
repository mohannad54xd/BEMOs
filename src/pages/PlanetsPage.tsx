import React from 'react';
import PlanetViewer from '../components/PlanetViewer';
import { Layout } from '../components/Layout';

const PlanetsPage: React.FC = () => {
  return (
    <Layout>
      <div id="content" className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-4">Planets Explorer</h1>
        <p className="text-gray-300 mb-6">A playful React conversion of the planets demo — interact with rotating planets and a starfield.</p>
        <PlanetViewer />
      </div>
    </Layout>
  );
};

export default PlanetsPage;
