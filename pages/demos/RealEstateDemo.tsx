import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RealEstateAgent } from '../../components/agents/RealEstateAgent';
import { DemoWrapper } from '../Demos';

export const RealEstateDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Real Estate AI Agent">
      <RealEstateAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
