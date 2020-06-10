import { ReactionTimeType } from "./Types";
import { FormInput } from "../components/utilities/Forms";

export interface Experiment {
  id: string;
  name?: string;
  link: string;
  requiredDataConfig: FormInput[];
  testsConfig: TestConfiguration[];
  expiration: Date;
  created: Date;
  disabled: boolean;
  allowMultipleAnswers: boolean;
}

export interface TestConfiguration {
  type: ReactionTimeType;
  tries: number;
}

export interface RequiredDataTemplate {
  name: string;
  data: FormInput[];
}

export interface TestsConfigTemplate {
  name: string;
  data: TestConfiguration[];
}
