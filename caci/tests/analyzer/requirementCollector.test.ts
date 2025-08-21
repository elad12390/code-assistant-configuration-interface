import { PROJECT_REQUIREMENTS_QUESTIONS } from '../../src/analyzer/questions';

describe('Requirement Collector', () => {
  it('should have required questions defined', () => {
    expect(PROJECT_REQUIREMENTS_QUESTIONS).toBeDefined();
    expect(Array.isArray(PROJECT_REQUIREMENTS_QUESTIONS)).toBe(true);
    expect(PROJECT_REQUIREMENTS_QUESTIONS.length).toBeGreaterThan(0);
  });

  it('should have project type question as required', () => {
    const projectTypeQuestion = PROJECT_REQUIREMENTS_QUESTIONS.find(q => q.id === 'project-type');
    expect(projectTypeQuestion).toBeDefined();
    expect(projectTypeQuestion?.required).toBe(true);
    expect(projectTypeQuestion?.type).toBe('single-choice');
    expect(projectTypeQuestion?.options).toContain('Web Application');
  });

  it('should have programming languages question', () => {
    const programmingLanguagesQuestion = PROJECT_REQUIREMENTS_QUESTIONS.find(
      q => q.id === 'programming-languages'
    );
    expect(programmingLanguagesQuestion).toBeDefined();
    expect(programmingLanguagesQuestion?.type).toBe('multiple-choice');
    expect(programmingLanguagesQuestion?.options).toContain('JavaScript/TypeScript');
  });
});
