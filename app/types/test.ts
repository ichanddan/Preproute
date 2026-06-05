export type Subject = { id: string; name: string };
export type Topic = { id: string; subject_id: string; name: string };
export type SubTopic = { id: string; topic_id: string; name: string };

export type TestStatus =
  | "draft"
  | "live"
  | "unpublished"
  | "scheduled"
  | "expired";

/**
 * A test as returned by the API. Note: on read, `subject`/`topics`/`sub_topics`
 * are NAMES; on write (create/update) they must be UUIDs.
 */
export type Test = {
  id: string;
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: string[] | null;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_marks: number;
  total_time: number;
  total_questions: number;
  status: TestStatus | null;
  created_at?: string;
  updated_at?: string | null;
  scheduled_date?: string | null;
  expiry_date?: string | null;
};

/** Body for `POST /tests` — subject/topics/sub_topics are UUIDs. */
export type CreateTestPayload = {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: TestStatus;
};

/** Body for `PUT /tests/:id` — every field optional (partial update). */
export type UpdateTestPayload = Partial<
  CreateTestPayload & {
    questions: string[];
    scheduled_date: string | null;
    expiry_date: string | null;
  }
>;
