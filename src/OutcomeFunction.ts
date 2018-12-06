import { Bag } from './bag';
import { Token, TokenEffects } from './tokens';

export type OutcomeFunction = (tokensPulled: Token[], outcomes?: TokenEffects, bag?: Bag) => boolean;
