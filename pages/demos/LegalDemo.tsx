import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LegalAgent } from '../../components/agents/LegalAgent';
import { DemoWrapper } from '../Demos';

export const LegalDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Legal Intake AI Agent">
      <LegalAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
