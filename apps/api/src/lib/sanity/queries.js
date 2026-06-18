import { sanityClient } from "./client";

const questionsQuery = `*[_type == "testQuestion" && isActive == true && topic in $topics] {
  "id": slug.current,
  topic,
  question,
  options,
  correctAnswer,
  language
}`;

export async function fetchQuestionsByTopics(topics) {
  if (!topics || topics.length === 0) return [];

  const questions = await sanityClient.fetch(questionsQuery, { topics });

  return questions.map((q) => ({
    ...q,
    options: shuffleArray(q.options || []),
  }));
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
