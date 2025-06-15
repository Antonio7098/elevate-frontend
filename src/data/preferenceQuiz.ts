export const preferenceQuizData = [
  {
    id: 1,
    scenario: "When learning a new concept, you prefer to:",
    choices: [
      { text: "Start with a big picture overview and then dive into details", mapsTo: "GLOBAL_OVERVIEW" },
      { text: "Learn step-by-step, building up from the basics", mapsTo: "STEP_BY_STEP" }
    ]
  },
  {
    id: 2,
    scenario: "You are most comfortable when explanations include:",
    choices: [
      { text: "Practical examples and real-world applications", mapsTo: "PRACTICAL_EXAMPLES" },
      { text: "Theoretical frameworks and abstract concepts", mapsTo: "THEORETICAL_FRAMEWORK" }
    ]
  },
  {
    id: 3,
    scenario: "In a group learning setting, you prefer to:",
    choices: [
      { text: "Actively participate in discussions and group activities", mapsTo: "ACTIVE_PARTICIPATION" },
      { text: "Listen and observe before contributing", mapsTo: "OBSERVATION" }
    ]
  },
  {
    id: 4,
    scenario: "When faced with a problem, you tend to:",
    choices: [
      { text: "Experiment and try different solutions", mapsTo: "EXPERIMENTATION" },
      { text: "Analyze the problem thoroughly before taking action", mapsTo: "ANALYSIS" }
    ]
  },
  {
    id: 5,
    scenario: "You learn best when the material is presented:",
    choices: [
      { text: "Visually, with diagrams and charts", mapsTo: "VISUAL" },
      { text: "Verbally, through lectures and discussions", mapsTo: "VERBAL" }
    ]
  }
]; 