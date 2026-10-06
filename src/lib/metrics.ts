export function brierScore(predictions:number[], outcomes:number[]):number {
  if (predictions.length !== outcomes.length || predictions.length === 0) return NaN;
  return predictions.reduce((sum,p,i)=>sum + (p-outcomes[i])**2,0)/predictions.length;
}
export function gatedSkill(model:number, baseline:number, count:number):{status:'collecting'|'ready';skill:number|null} {
  if (count < 20) return {status:'collecting',skill:null};
  if (!Number.isFinite(baseline) || baseline === 0) return {status:'ready',skill:null};
  return {status:'ready',skill:1-model/baseline};
}
