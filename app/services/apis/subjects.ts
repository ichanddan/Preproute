import { axiosApi, responseHandler } from "~/services/core";
import type { ApiEnvelope, SubTopic, Subject, Topic } from "~/types";

export const SubjectApi = {
  GetSubjects: () =>
    responseHandler<ApiEnvelope<Subject[]>>(axiosApi.get("/subjects")),

  GetTopics: (subjectId: string) =>
    responseHandler<ApiEnvelope<Topic[]>>(
      axiosApi.get(`/topics/subject/${subjectId}`),
    ),

  GetSubTopics: (topicId: string) =>
    responseHandler<ApiEnvelope<SubTopic[]>>(
      axiosApi.get(`/sub-topics/topic/${topicId}`),
    ),

  GetSubTopicsByTopics: (topicIds: string[]) =>
    responseHandler<ApiEnvelope<SubTopic[]>>(
      axiosApi.post("/sub-topics/multi-topics", { topicIds }),
    ),
};
