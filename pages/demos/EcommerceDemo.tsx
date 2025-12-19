import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EcommerceAgent } from '../../components/agents/EcommerceAgent';
import { DemoWrapper } from '../Demos';

export const EcommerceDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="E-commerce Support AI Agent">
      <EcommerceAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
