import { ReactionTimeType } from './Types';

interface AbstractUser {
	token?: string;
	username: string;
	name: string;
	email: string;
	created: Date;
}

export interface User extends AbstractUser {
	scores: Scores;
}

export type Admin = AbstractUser;

export interface SpecificScore {
	type: ReactionTimeType;
	date: Date;
	tries?: number;
	average: number;
	best: number;
	success: number;
}

export type SpecificScores = SpecificScore[];

type Scores = { [type in ReactionTimeType]: SpecificScores }
