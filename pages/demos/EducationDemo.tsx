import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EducationAgent } from '../../components/agents/EducationAgent';
import { DemoWrapper } from '../Demos';

export const EducationDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Education AI Agent">
      <EducationAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
