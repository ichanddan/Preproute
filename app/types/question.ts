export type QuestionOption = "option1" | "option2" | "option3" | "option4";

/** Body for one entry in `POST /questions/bulk`. subject/topic/sub_topic are NAMES. */
export type QuestionPayload = {
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: QuestionOption;
  explanation?: string;
  difficulty?: string;
  subject: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id: string;
};

export type Question = QuestionPayload & {
  id: string;
  created_at?: string;
  updated_at?: string | null;
};
