import { talents } from "./talents";

export function upgradeEnabled(old:boolean[]){
  const newEnabled = handleUpgradeLogic(old);
  localStorage.setItem('enabledTalents',newEnabled.toString());
  return newEnabled;
}

function handleUpgradeLogic(old:boolean[]){
  if(!(old.length in upgradeMap)){
    return new Array(talents.length).fill(true);
  }
  let newEnabled = old.slice()
  while(newEnabled.length in upgradeMap){
    newEnabled = upgradeMap[newEnabled.length](newEnabled);
  }
  return newEnabled;
}

const upgradeMap:Record<number,(v:boolean[]) => boolean[]> = {
  38: upgradeToV7,
}

function upgradeToV7(old:boolean[]){
  return old.toSpliced(old.length,0,...(new Array(9).fill(true)));
}