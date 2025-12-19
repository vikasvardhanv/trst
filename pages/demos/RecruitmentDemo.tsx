import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecruitmentAgent } from '../../components/agents/RecruitmentAgent';
import { DemoWrapper } from '../Demos';

export const RecruitmentDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Recruitment AI Agent">
      <RecruitmentAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
