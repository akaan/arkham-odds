import { Bag } from './bag';
import { Token, TokenEffects } from './tokens';

export type OutcomeFunction = (tokensPulled: Token[], tokenEffects?: TokenEffects, bag?: Bag) => boolean;
