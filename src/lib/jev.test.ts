import { describe, expect, it } from 'vitest';
import { parseJevClassification } from './jev';
describe('Jev classification parsing',()=>{
 it('maps typed choices into independent article fields',()=>{
  expect(parseJevClassification({answers:{topic:{choice:'technology'},region:{choice:'india'},content_type:{choice:'analysis'},time_sensitivity:{choice:'current'}}})).toEqual({domain:'technology',region:'india',contentType:'analysis',timeSensitivity:'current'});
 });
 it('returns null when the response is incomplete',()=>expect(parseJevClassification({answers:{}})).toBeNull());
});
