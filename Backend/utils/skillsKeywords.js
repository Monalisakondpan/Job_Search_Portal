// Master skill dictionary used for keyword-based ATS matching.
// This is intentionally simple: substring matching with word boundaries,
// not semantic NLP. Real ATS tools at this scale work the same way —
// the value is in a clean, maintainable skill list, not a fancier algorithm.
//
// Each entry: canonical display name + the text variants we should catch
// inside a resume or job description.

export const SKILLS_DICTIONARY = [
  // Languages
  { name: "JavaScript", patterns: ["javascript", "js"] },
  { name: "TypeScript", patterns: ["typescript", "ts"] },
  { name: "Python", patterns: ["python"] },
  { name: "Java", patterns: ["java"] },
  { name: "C++", patterns: ["c++", "cpp"] },
  { name: "C#", patterns: ["c#", "csharp"] },
  { name: "C", patterns: ["c language"] },
  { name: "Go", patterns: ["golang", "go lang"] },
  { name: "Ruby", patterns: ["ruby"] },
  { name: "PHP", patterns: ["php"] },
  { name: "Rust", patterns: ["rust"] },
  { name: "Kotlin", patterns: ["kotlin"] },
  { name: "Swift", patterns: ["swift"] },
  { name: "SQL", patterns: ["sql"] },

  // Frontend
  { name: "React", patterns: ["react.js", "reactjs", "react"] },
  { name: "Redux", patterns: ["redux"] },
  { name: "Vue.js", patterns: ["vue.js", "vuejs", "vue"] },
  { name: "Angular", patterns: ["angular.js", "angularjs", "angular"] },
  { name: "Next.js", patterns: ["next.js", "nextjs"] },
  { name: "HTML", patterns: ["html5", "html"] },
  { name: "CSS", patterns: ["css3", "css"] },
  { name: "Tailwind CSS", patterns: ["tailwind css", "tailwindcss", "tailwind"] },
  { name: "Bootstrap", patterns: ["bootstrap"] },
  { name: "Sass", patterns: ["sass", "scss"] },
  { name: "Vite", patterns: ["vite"] },
  { name: "Webpack", patterns: ["webpack"] },

  // Backend
  { name: "Node.js", patterns: ["node.js", "nodejs", "node js"] },
  { name: "Express.js", patterns: ["express.js", "expressjs", "express"] },
  { name: "Django", patterns: ["django"] },
  { name: "Flask", patterns: ["flask"] },
  { name: "Spring Boot", patterns: ["spring boot", "springboot"] },
  { name: "Laravel", patterns: ["laravel"] },
  { name: "ASP.NET", patterns: ["asp.net", "aspnet"] },
  { name: "GraphQL", patterns: ["graphql"] },
  { name: "REST API", patterns: ["rest api", "restful api", "rest apis"] },
  { name: "Microservices", patterns: ["microservices", "microservice"] },

  // Databases
  { name: "MongoDB", patterns: ["mongodb", "mongo db"] },
  { name: "MySQL", patterns: ["mysql"] },
  { name: "PostgreSQL", patterns: ["postgresql", "postgres"] },
  { name: "Redis", patterns: ["redis"] },
  { name: "Firebase", patterns: ["firebase"] },
  { name: "SQLite", patterns: ["sqlite"] },
  { name: "Mongoose", patterns: ["mongoose"] },
  { name: "Elasticsearch", patterns: ["elasticsearch"] },

  // Cloud / DevOps
  { name: "AWS", patterns: ["aws", "amazon web services"] },
  { name: "Azure", patterns: ["azure"] },
  { name: "Google Cloud", patterns: ["google cloud", "gcp"] },
  { name: "Docker", patterns: ["docker"] },
  { name: "Kubernetes", patterns: ["kubernetes", "k8s"] },
  { name: "CI/CD", patterns: ["ci/cd", "ci-cd", "continuous integration"] },
  { name: "Jenkins", patterns: ["jenkins"] },
  { name: "Nginx", patterns: ["nginx"] },
  { name: "Linux", patterns: ["linux"] },
  { name: "Git", patterns: ["git"] },
  { name: "GitHub", patterns: ["github"] },
  { name: "GitLab", patterns: ["gitlab"] },

  // Testing
  { name: "Jest", patterns: ["jest"] },
  { name: "Mocha", patterns: ["mocha"] },
  { name: "Cypress", patterns: ["cypress"] },
  { name: "Selenium", patterns: ["selenium"] },
  { name: "Postman", patterns: ["postman"] },
  { name: "Unit Testing", patterns: ["unit testing", "unit tests"] },

  // Mobile
  { name: "React Native", patterns: ["react native"] },
  { name: "Flutter", patterns: ["flutter"] },
  { name: "Android Development", patterns: ["android development", "android sdk"] },
  { name: "iOS Development", patterns: ["ios development"] },

  // Data / AI
  { name: "Machine Learning", patterns: ["machine learning", "ml"] },
  { name: "Deep Learning", patterns: ["deep learning"] },
  { name: "Data Analysis", patterns: ["data analysis"] },
  { name: "Pandas", patterns: ["pandas"] },
  { name: "NumPy", patterns: ["numpy"] },
  { name: "TensorFlow", patterns: ["tensorflow"] },
  { name: "PyTorch", patterns: ["pytorch"] },
  { name: "Power BI", patterns: ["power bi", "powerbi"] },
  { name: "Tableau", patterns: ["tableau"] },
  { name: "Excel", patterns: ["excel", "ms excel"] },

  // Design
  { name: "Figma", patterns: ["figma"] },
  { name: "Adobe XD", patterns: ["adobe xd"] },
  { name: "Photoshop", patterns: ["photoshop"] },
  { name: "UI/UX Design", patterns: ["ui/ux", "ui ux", "user experience design"] },

  // Methodology / Soft
  { name: "Agile", patterns: ["agile"] },
  { name: "Scrum", patterns: ["scrum"] },
  { name: "Jira", patterns: ["jira"] },
  { name: "Project Management", patterns: ["project management"] },
  { name: "Communication", patterns: ["communication skills", "communication"] },
  { name: "Leadership", patterns: ["leadership"] },
  { name: "Problem Solving", patterns: ["problem solving", "problem-solving"] },
];

// Escape regex special characters in a pattern before building a RegExp.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Scan a block of text and return canonical skill names found in it.
 * Case-insensitive, word-boundary aware (so "java" doesn't match inside "javascript").
 */
export function findSkillsInText(text) {
  if (!text || typeof text !== "string") return [];
  const lowerText = text.toLowerCase();
  const found = new Set();

  for (const skill of SKILLS_DICTIONARY) {
    for (const pattern of skill.patterns) {
      const escaped = escapeRegex(pattern.toLowerCase());
      // Use word boundaries where the pattern starts/ends with a word character.
      const startsWord = /^\w/.test(pattern);
      const endsWord = /\w$/.test(pattern);
      const regex = new RegExp(
        `${startsWord ? "\\b" : ""}${escaped}${endsWord ? "\\b" : ""}`,
        "i"
      );
      if (regex.test(lowerText)) {
        found.add(skill.name);
        break; // no need to check other patterns for this skill
      }
    }
  }
  return Array.from(found);
}
