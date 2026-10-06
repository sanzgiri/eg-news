import { describe, expect, it } from 'vitest';
import { brierScore, gatedSkill } from './metrics';

describe('interest metrics', () => {
  it('calculates Brier score', () => expect(brierScore([0.8, 0.2], [1, 0])).toBeCloseTo(0.04));
  it('gates skill until enough responses and preserves negative skill', () => {
    expect(gatedSkill(0.1, 0.2, 19)).toEqual({ status: 'collecting', skill: null });
    expect(gatedSkill(0.3, 0.2, 20)).toMatchObject({ status: 'ready' });
    expect(gatedSkill(0.3, 0.2, 20).skill).toBeCloseTo(-0.5);
  });
});
