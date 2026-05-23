import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/home/Dashboard';
import MyPC from './components/builder/MyPC';
import Benchmark from './components/benchmark/Benchmark';
import Collection from './components/collection/Collection';
import Community from './components/community/Community';
import Settings from './components/settings/Settings';
import BudgetPlanner from './components/budget/BudgetPlanner';
import PageTransition from './components/common/PageTransition';
import NotFound from './components/not-found/NotFound';

export default function App() {
  return (
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<MyPC />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}
