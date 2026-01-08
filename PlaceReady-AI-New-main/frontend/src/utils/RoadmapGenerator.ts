import { LearningPath, generateLearningPath } from './LearningPaths';

export interface RoadmapMilestone {
  month: number;
  title: string;
  goals: string[];
  skills: string[];
  metrics: string[];
}

export interface Roadmap {
  duration: 3 | 6 | 12;
  milestones: RoadmapMilestone[];
  focusAreas: string[];
}

export const generateRoadmap = (
  skillGaps: string[],
  currentScore: number,
  targetScore: number,
  duration: 3 | 6 | 12
): Roadmap => {
  const focusAreas = skillGaps.slice(0, duration === 3 ? 2 : duration === 6 ? 4 : 6);
  const scoreImprovement = targetScore - currentScore;
  const monthlyImprovement = scoreImprovement / duration;

  const milestones: RoadmapMilestone[] = [];

  for (let month = 1; month <= duration; month++) {
    const skillsForThisMonth = focusAreas.slice(0, Math.ceil((focusAreas.length * month) / duration));
    const targetScoreForMonth = Math.round(currentScore + monthlyImprovement * month);

    milestones.push({
      month,
      title: `Month ${month} Milestone`,
      goals: [
        `Achieve ${targetScoreForMonth}% overall readiness score`,
        `Complete learning path for ${skillsForThisMonth[skillsForThisMonth.length - 1] || 'key skills'}`,
        `Build ${month === 1 ? '1' : month === 3 ? '2' : '3'} portfolio projects`,
      ],
      skills: skillsForThisMonth,
      metrics: [
        `Score: ${currentScore}% → ${targetScoreForMonth}%`,
        `Skills mastered: ${Math.ceil((skillsForThisMonth.length / focusAreas.length) * 100)}%`,
        `LeetCode problems solved: ${month * 20}`,
      ],
    });
  }

  return {
    duration,
    milestones,
    focusAreas,
  };
};

