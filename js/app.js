/* Duelo de Tipos: lógica do jogo.
   Seções, em ordem: dados e tabela de tipos, idioma (i18n), utilidades, geradores de perguntas,
   estado e armazenamento, regras do jogo, telas (menu, escolha do duelo, opções, como jogar, jogo, resultado, estudo), eventos. */

'use strict';
/* ---------- dados ---------- */
const T=['normal','fogo','agua','eletrico','planta','gelo','lutador','veneno','terra','voador','psiquico','inseto','pedra','fantasma','dragao','sombrio','aco','fada'];
const COLOR={normal:'#A8A77A',fogo:'#EE8130',agua:'#6390F0',eletrico:'#F7D02C',planta:'#7AC74C',gelo:'#96D9D6',lutador:'#C22E28',veneno:'#A33EA1',terra:'#E2BF65',voador:'#A98FF3',psiquico:'#F95587',inseto:'#A6B91A',pedra:'#B6A136',fantasma:'#735797',dragao:'#6F35FC',sombrio:'#705746',aco:'#B7B7CE',fada:'#D685AD'};

function lum(hex){
  const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4));
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];
}
const ON={};
T.forEach(t=>{const L=lum(COLOR[t]);ON[t]=(1.05/(L+0.05))>=((L+0.05)/(lum('#10151F')+0.05))?'#FFFFFF':'#10151F';});

const C=(se,nve,imm)=>({se,nve,imm});
const CHART={
  normal:C([],['pedra','aco'],['fantasma']),
  fogo:C(['planta','gelo','inseto','aco'],['fogo','agua','pedra','dragao'],[]),
  agua:C(['fogo','terra','pedra'],['agua','planta','dragao'],[]),
  eletrico:C(['agua','voador'],['eletrico','planta','dragao'],['terra']),
  planta:C(['agua','terra','pedra'],['fogo','planta','veneno','voador','inseto','dragao','aco'],[]),
  gelo:C(['planta','terra','voador','dragao'],['fogo','agua','gelo','aco'],[]),
  lutador:C(['normal','gelo','pedra','sombrio','aco'],['veneno','voador','psiquico','inseto','fada'],['fantasma']),
  veneno:C(['planta','fada'],['veneno','terra','pedra','fantasma'],['aco']),
  terra:C(['fogo','eletrico','veneno','pedra','aco'],['planta','inseto'],['voador']),
  voador:C(['planta','lutador','inseto'],['eletrico','pedra','aco'],[]),
  psiquico:C(['lutador','veneno'],['psiquico','aco'],['sombrio']),
  inseto:C(['planta','psiquico','sombrio'],['fogo','lutador','veneno','voador','fantasma','aco','fada'],[]),
  pedra:C(['fogo','gelo','voador','inseto'],['lutador','terra','aco'],[]),
  fantasma:C(['psiquico','fantasma'],['sombrio'],['normal']),
  dragao:C(['dragao'],['aco'],['fada']),
  sombrio:C(['psiquico','fantasma'],['lutador','sombrio','fada'],[]),
  aco:C(['gelo','pedra','fada'],['fogo','agua','eletrico','aco'],[]),
  fada:C(['lutador','dragao','sombrio'],['fogo','veneno','aco'],[])
};
function eff(a,d){const c=CHART[a];return c.se.includes(d)?2:c.nve.includes(d)?0.5:c.imm.includes(d)?0:1;}
function mult(a,defs){return defs.reduce((m,d)=>m*eff(a,d),1);}

const P=(n,name,...t)=>({n,name,t});
const POKE=[
  P(1,'Bulbasaur','planta','veneno'),P(3,'Venusaur','planta','veneno'),P(4,'Charmander','fogo'),P(6,'Charizard','fogo','voador'),
  P(7,'Squirtle','agua'),P(9,'Blastoise','agua'),P(12,'Butterfree','inseto','voador'),P(18,'Pidgeot','normal','voador'),
  P(25,'Pikachu','eletrico'),P(26,'Raichu','eletrico'),P(35,'Clefairy','fada'),P(37,'Vulpix','fogo'),
  P(39,'Jigglypuff','normal','fada'),P(41,'Zubat','veneno','voador'),P(43,'Oddish','planta','veneno'),P(50,'Diglett','terra'),
  P(52,'Meowth','normal'),P(54,'Psyduck','agua'),P(58,'Growlithe','fogo'),P(63,'Abra','psiquico'),
  P(66,'Machop','lutador'),P(74,'Geodude','pedra','terra'),P(79,'Slowpoke','agua','psiquico'),P(81,'Magnemite','eletrico','aco'),
  P(92,'Gastly','fantasma','veneno'),P(94,'Gengar','fantasma','veneno'),P(95,'Onix','pedra','terra'),P(98,'Krabby','agua'),
  P(104,'Cubone','terra'),P(113,'Chansey','normal'),P(122,'Mr. Mime','psiquico','fada'),P(123,'Scyther','inseto','voador'),
  P(124,'Jynx','gelo','psiquico'),P(125,'Electabuzz','eletrico'),P(126,'Magmar','fogo'),P(129,'Magikarp','agua'),
  P(130,'Gyarados','agua','voador'),P(131,'Lapras','agua','gelo'),P(132,'Ditto','normal'),P(133,'Eevee','normal'),
  P(134,'Vaporeon','agua'),P(135,'Jolteon','eletrico'),P(136,'Flareon','fogo'),P(143,'Snorlax','normal'),
  P(144,'Articuno','gelo','voador'),P(145,'Zapdos','eletrico','voador'),P(146,'Moltres','fogo','voador'),P(147,'Dratini','dragao'),
  P(149,'Dragonite','dragao','voador'),P(150,'Mewtwo','psiquico'),P(151,'Mew','psiquico'),P(152,'Chikorita','planta'),
  P(158,'Totodile','agua'),P(175,'Togepi','fada'),P(181,'Ampharos','eletrico'),P(196,'Espeon','psiquico'),
  P(197,'Umbreon','sombrio'),P(212,'Scizor','inseto','aco'),P(214,'Heracross','inseto','lutador'),P(227,'Skarmory','aco','voador'),
  P(248,'Tyranitar','pedra','sombrio'),P(249,'Lugia','psiquico','voador'),P(282,'Gardevoir','psiquico','fada'),P(302,'Sableye','sombrio','fantasma'),
  P(306,'Aggron','aco','pedra'),P(330,'Flygon','terra','dragao'),P(373,'Salamence','dragao','voador'),P(376,'Metagross','aco','psiquico'),
  P(384,'Rayquaza','dragao','voador'),P(392,'Infernape','fogo','lutador'),P(395,'Empoleon','agua','aco'),P(445,'Garchomp','dragao','terra'),
  P(448,'Lucario','lutador','aco'),P(468,'Togekiss','fada','voador'),P(470,'Leafeon','planta'),P(471,'Glaceon','gelo'),
  P(609,'Chandelure','fantasma','fogo'),P(635,'Hydreigon','sombrio','dragao'),P(658,'Greninja','agua','sombrio'),P(700,'Sylveon','fada'),
  P(778,'Mimikyu','fantasma','fada')
];
const DUALS=(()=>{
  const m=new Map();
  POKE.filter(p=>p.t.length===2).forEach(p=>{const k=[...p.t].sort().join('/');if(!m.has(k))m.set(k,{types:p.t,ex:p.name});});
  return [...m.values()];
})();

/* ---------- idioma ---------- */
const LANGS=['pt','en'];
let LANG='pt';
try{
  const saved=localStorage.getItem('duelo-tipos:lang');
  if(LANGS.includes(saved))LANG=saved;
  else if(/^en/i.test(navigator.language||''))LANG='en';
}catch(e){
  try{if(/^en/i.test(navigator.language||''))LANG='en';}catch(_){}
}
function setLang(l){
  if(!LANGS.includes(l))return;
  LANG=l;
  try{localStorage.setItem('duelo-tipos:lang',l);}catch(e){}
}
const NAMES={
  pt:{normal:'Normal',fogo:'Fogo',agua:'Água',eletrico:'Elétrico',planta:'Planta',gelo:'Gelo',lutador:'Lutador',veneno:'Veneno',terra:'Terra',voador:'Voador',psiquico:'Psíquico',inseto:'Inseto',pedra:'Pedra',fantasma:'Fantasma',dragao:'Dragão',sombrio:'Sombrio',aco:'Aço',fada:'Fada'},
  en:{normal:'Normal',fogo:'Fire',agua:'Water',eletrico:'Electric',planta:'Grass',gelo:'Ice',lutador:'Fighting',veneno:'Poison',terra:'Ground',voador:'Flying',psiquico:'Psychic',inseto:'Bug',pedra:'Rock',fantasma:'Ghost',dragao:'Dragon',sombrio:'Dark',aco:'Steel',fada:'Fairy'}
};
const D={
pt:{
  title:'Duelo de Tipos', dexPre:'Nº ', langLabel:'Idioma',
  study:'Estudar tipos', back:'Voltar',
  difficulty:'Dificuldade', diffs:{facil:'Fácil',medio:'Médio',dificil:'Difícil'},
  dd:{facil:'Só tipos únicos. Os Pokémon e os defensores têm um tipo só.',medio:'Mistura tipos únicos e duplos.',dificil:'Só tipos duplos. Os multiplicadores 4× e ¼× entram em jogo.'},
  hide:'Nos modos com Pokémon, você precisa saber quais são os tipos dele.',
  modes:{
    ataque:{name:'Ataque',desc:'Um tipo ataca outro. Qual é o multiplicador de dano?'},
    fraquezas:{name:'Fraquezas',desc:'Veja um Pokémon e marque todos os tipos que causam dano extra nele.'},
    golpe:{name:'Melhor golpe',desc:'Quatro tipos de golpe, só um é o mais efetivo contra o Pokémon.'},
    misto:{name:'Treino misto',desc:'Os três modos embaralhados em uma só partida.'}
  },
  record:'Recorde: ',
  qAria:(i,n)=>`Pergunta ${i} de ${n}`, points:'Pontos', streak:'Sequência', hidden:'Tipos ocultos',
  move:'Golpe', defender:'Defensor', qMult:'Qual é o multiplicador de dano?',
  ml:{0:'Sem efeito',0.25:'Muito pouco efetivo',0.5:'Pouco efetivo',1:'Dano normal',2:'Super efetivo',4:'Extremamente efetivo'},
  qBest:n=>`Qual tipo de golpe é o mais efetivo contra ${n}?`,
  qWeak:(n,c,hint)=>`Marque todos os tipos que causam dano extra (2× ou 4×) em ${n}.`+(hint?` Ele tem ${c} fraqueza${c===1?'':'s'}.`:''),
  selected:n=>`${n} selecionado${n===1?'':'s'}`, verify:'Verificar',
  okHead:'Correto', badHead:'Não foi dessa vez', perfect:'Perfeito', almost:(h,t)=>`Quase: ${h} de ${t}`,
  next:'Próxima pergunta', seeResult:'Ver resultado',
  gain:p=>`+${p} pontos`, noPts:'Sem pontos nesta rodada',
  exSingle:(a,d,m,l)=>`${a} contra ${d} dá <b>${m}</b>: ${l}.`,
  exDual:(a,d1,e1,d2,e2,m,l,ex)=>`${a} contra ${d1} dá ${e1} e contra ${d2} dá ${e2}. Os efeitos se multiplicam: <b>${m}</b>, ${l}.`+(ex?` Exemplo de Pokémon assim: ${ex}.`:''),
  exBest:(n,b,m)=>`O mais efetivo contra <b>${n}</b> era ${b} <b>${m}</b>.`,
  weaknessesOf:n=>`Fraquezas de ${n}:`,
  exWeak:(n,ty)=>`<b>${n}</b> (${ty}) é fraco contra:`,
  keys:max=>`Atalhos: teclas 1 a ${max} respondem e Enter avança.`,
  qLabel:(i,n,m)=>`Pergunta ${i} de ${n} · ${m}`, exit:'Sair',
  result:'Resultado', hits:'Acertos', of:(a,b)=>`${a} de ${b}`, bestStreak:'Melhor sequência',
  newRecord:'Novo recorde', again:'Jogar de novo', changeMode:'Trocar de modo', review:'Revisão',
  grades:['Campeão da liga','Elite dos quatro','Líder de ginásio','Treinador de rota','Treinador iniciante'],
  marks:{ok:'Acertou',part:'Acertou em parte',no:'Errou'},
  revBest:(b,m)=>`Mais efetivo: ${b} <b>${m}</b>`,
  studyLede:'Escolha um tipo para ver o que ele vence, o que o vence e o que não o afeta. Em tipos duplos, multiplique os dois efeitos.',
  attackingWith:b=>`Atacando com ${b}`, defendingAs:b=>`Defendendo como ${b}`,
  seLine:'Super efetivo contra', nveLine:'Pouco efetivo contra', immLine:'Sem efeito contra',
  weakTo:'Fraco contra', resists:'Resiste a', immuneTo:'Imune a', none:'Nenhum',
  fullTable:'Tabela completa', caption:'Tabela de tipos: linhas são atacantes, colunas são defensores', corner:'ATQ ↓ DEF →',
  lgSe:'super efetivo', lgNve:'pouco efetivo', lgImm:'sem efeito', lgNormal:'vazio: dano normal',
  cell:(a,d,m)=>`${a} contra ${d}: ${m}`,
  titleA:'Duelo', titleB:'de Tipos',
  tagline:'Quem vence quem? Treine as fraquezas dos 18 tipos Pokémon.',
  navPlay:'Jogar', navPlayD:'Escolha a dificuldade e o modo de duelo',
  navStudyD:'Fraquezas de cada tipo e a tabela completa',
  navHow:'Como jogar', navHowD:'Regras, pontuação e atalhos',
  navOpt:'Opções', navOptD:'Idioma, tipos ocultos e recordes',
  toMenu:'Menu', vs:'VS',
  pickTitle:'Escolha seu duelo', pickSub:'Defina a dificuldade e entre em um dos modos.',
  optHide:'Ocultar tipos do Pokémon', optRecords:'Recordes',
  optRecordsD:'Apaga os melhores placares salvos neste navegador.',
  clear:'Apagar recordes', clearSure:'Toque de novo para confirmar', cleared:'Recordes apagados.',
  howGoal:'Cada partida tem 10 perguntas. Escolha um modo, responda e veja a explicação de cada resposta.',
  howModesT:'Os modos', howMultT:'Multiplicadores',
  howMult:{4:'Extremamente efetivo: os dois tipos do defensor são fracos contra o golpe.',2:'Super efetivo: o dano é dobrado.',1:'Dano normal.',0.5:'Pouco efetivo: o dano cai pela metade.',0.25:'Muito pouco efetivo: os dois tipos do defensor resistem.',0:'Sem efeito: o defensor é imune ao golpe.'},
  howScoreT:'Pontuação',
  howScore:['Cada acerto vale 100 pontos, mais 10 por acerto seguido (o bônus chega a 50).','No modo Fraquezas, acertar só parte dá pontos proporcionais, e marcar um tipo errado reduz a pontuação.','Errar zera a sequência. O melhor placar de cada modo e dificuldade fica salvo no navegador.'],
  howKeysT:'Atalhos', howKeys:'Teclas 1 a 6 respondem no modo Ataque, e 1 a 4 no modo Melhor golpe. Enter avança e, no modo Fraquezas, verifica a resposta. Esc volta.',
  legalTitle:'Aviso legal', legalShort:'Projeto de fã, sem fins lucrativos e sem vínculo com a Nintendo, a Creatures Inc. ou a GAME FREAK inc.', legalLink:'Aviso legal',
  legal1:'<strong>Projeto de fã, gratuito e sem fins lucrativos.</strong> Este site não é afiliado, patrocinado, aprovado nem endossado pela Nintendo, pela Creatures Inc. ou pela GAME FREAK inc.',
  legal2:'Pokémon, os nomes dos Pokémon e dos tipos e os demais elementos relacionados são marcas registradas e propriedade da Nintendo, Creatures Inc. e GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. Todos os direitos reservados aos seus respectivos titulares.',
  legal3:'Este jogo não usa imagens, sprites, logotipos, músicas nem outros materiais oficiais. Os nomes são citados apenas para identificar os personagens, com finalidade educativa.'
},
en:{
  title:'Type Duel', dexPre:'No. ', langLabel:'Language',
  study:'Study types', back:'Back',
  difficulty:'Difficulty', diffs:{facil:'Easy',medio:'Medium',dificil:'Hard'},
  dd:{facil:'Single types only. Pokémon and defenders have just one type.',medio:'A mix of single and dual types.',dificil:'Dual types only. The 4× and ¼× multipliers come into play.'},
  hide:'In modes that show a Pokémon, you have to know its types.',
  modes:{
    ataque:{name:'Attack',desc:'One type attacks another. What is the damage multiplier?'},
    fraquezas:{name:'Weaknesses',desc:'See a Pokémon and mark every type that deals extra damage to it.'},
    golpe:{name:'Best move',desc:'Four move types, only one is the most effective against the Pokémon.'},
    misto:{name:'Mixed training',desc:'All three modes shuffled into a single round.'}
  },
  record:'Best: ',
  qAria:(i,n)=>`Question ${i} of ${n}`, points:'Score', streak:'Streak', hidden:'Types hidden',
  move:'Move', defender:'Defender', qMult:'What is the damage multiplier?',
  ml:{0:'No effect',0.25:'Heavily resisted',0.5:'Not very effective',1:'Normal damage',2:'Super effective',4:'Extremely effective'},
  qBest:n=>`Which move type is the most effective against ${n}?`,
  qWeak:(n,c,hint)=>`Mark every type that deals extra damage (2× or 4×) to ${n}.`+(hint?` It has ${c} weakness${c===1?'':'es'}.`:''),
  selected:n=>`${n} selected`, verify:'Check',
  okHead:'Correct', badHead:'Not this time', perfect:'Perfect', almost:(h,t)=>`Close: ${h} of ${t}`,
  next:'Next question', seeResult:'See results',
  gain:p=>`+${p} points`, noPts:'No points this round',
  exSingle:(a,d,m,l)=>`${a} against ${d} gives <b>${m}</b>: ${l}.`,
  exDual:(a,d1,e1,d2,e2,m,l,ex)=>`${a} against ${d1} gives ${e1}, and against ${d2} gives ${e2}. The effects multiply: <b>${m}</b>, ${l}.`+(ex?` A Pokémon like this: ${ex}.`:''),
  exBest:(n,b,m)=>`The most effective against <b>${n}</b> was ${b} <b>${m}</b>.`,
  weaknessesOf:n=>`${n}’s weaknesses:`,
  exWeak:(n,ty)=>`<b>${n}</b> (${ty}) is weak to:`,
  keys:max=>`Shortcuts: keys 1 to ${max} answer, and Enter moves on.`,
  qLabel:(i,n,m)=>`Question ${i} of ${n} · ${m}`, exit:'Quit',
  result:'Results', hits:'Correct', of:(a,b)=>`${a} of ${b}`, bestStreak:'Best streak',
  newRecord:'New record', again:'Play again', changeMode:'Change mode', review:'Review',
  grades:['League champion','Elite Four','Gym leader','Route trainer','Rookie trainer'],
  marks:{ok:'Correct',part:'Partly correct',no:'Wrong'},
  revBest:(b,m)=>`Most effective: ${b} <b>${m}</b>`,
  studyLede:'Pick a type to see what it beats, what beats it and what it does not affect. For dual types, multiply both effects.',
  attackingWith:b=>`Attacking with ${b}`, defendingAs:b=>`Defending as ${b}`,
  seLine:'Super effective against', nveLine:'Not very effective against', immLine:'No effect on',
  weakTo:'Weak to', resists:'Resists', immuneTo:'Immune to', none:'None',
  fullTable:'Full type chart', caption:'Type chart: rows are attackers, columns are defenders', corner:'ATK ↓ DEF →',
  lgSe:'super effective', lgNve:'not very effective', lgImm:'no effect', lgNormal:'blank: normal damage',
  cell:(a,d,m)=>`${a} vs ${d}: ${m}`,
  titleA:'Type', titleB:'Duel',
  tagline:'Who beats whom? Train the weaknesses of all 18 Pokémon types.',
  navPlay:'Play', navPlayD:'Pick a difficulty and a duel mode',
  navStudyD:'Every type\u2019s matchups and the full chart',
  navHow:'How to play', navHowD:'Rules, scoring and shortcuts',
  navOpt:'Options', navOptD:'Language, hidden types and best scores',
  toMenu:'Menu', vs:'VS',
  pickTitle:'Choose your duel', pickSub:'Set the difficulty and jump into a mode.',
  optHide:'Hide the Pokémon\u2019s types', optRecords:'Best scores',
  optRecordsD:'Deletes the best scores saved in this browser.',
  clear:'Clear best scores', clearSure:'Tap again to confirm', cleared:'Best scores cleared.',
  howGoal:'Each round has 10 questions. Pick a mode, answer, and read the explanation for every answer.',
  howModesT:'The modes', howMultT:'Multipliers',
  howMult:{4:'Extremely effective: both of the defender\u2019s types are weak to the move.',2:'Super effective: damage is doubled.',1:'Normal damage.',0.5:'Not very effective: damage is halved.',0.25:'Heavily resisted: both of the defender\u2019s types resist the move.',0:'No effect: the defender is immune to the move.'},
  howScoreT:'Scoring',
  howScore:['Each correct answer is worth 100 points, plus 10 for every correct answer in a row (the bonus tops out at 50).','In Weaknesses mode, getting only some right gives proportional points, and marking a wrong type lowers the score.','A wrong answer resets the streak. The best score for each mode and difficulty is saved in the browser.'],
  howKeysT:'Shortcuts', howKeys:'Keys 1 to 6 answer in Attack mode, and 1 to 4 in Best move mode. Enter moves on and, in Weaknesses mode, checks your answer. Esc goes back.',
  legalTitle:'Legal notice', legalShort:'A free, non-profit fan project with no ties to Nintendo, Creatures Inc. or GAME FREAK inc.', legalLink:'Legal notice',
  legal1:'<strong>Fan project, free and non-profit.</strong> This site is not affiliated with, sponsored by, approved by or endorsed by Nintendo, Creatures Inc. or GAME FREAK inc.',
  legal2:'Pokémon, the names of Pokémon and types, and all related elements are trademarks and property of Nintendo, Creatures Inc. and GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. All rights reserved to their respective owners.',
  legal3:'This game uses no official images, sprites, logos, music or other materials. Names are used only to identify the characters, for educational purposes.'
}};
const tr=(k,...a)=>{const v=D[LANG][k];return typeof v==='function'?v(...a):v;};
const LABEL=new Proxy({},{get:(_,k)=>NAMES[LANG][k]});
const mlabel=m=>D[LANG].ml[m];

/* ---------- utilidades ---------- */
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
const FMT={0:'0×',0.25:'¼×',0.5:'½×',1:'1×',2:'2×',4:'4×'};
const fmt=m=>FMT[m];
const MULTS=[0,0.25,0.5,1,2,4];
const ARROW='<svg class="arrow" viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12h32M26 4l10 8-10 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const badge=(t,cls='')=>`<span class="tb ${cls}" style="--c:${COLOR[t]};--on:${ON[t]}">${LABEL[t]}</span>`;
const dexNo=n=>tr('dexPre')+String(n).padStart(3,'0');
const abbr=t=>LABEL[t].slice(0,3).toUpperCase();

function weaknessOf(p){
  const out={};
  T.forEach(t=>{const m=mult(t,p.t);if(m>1)out[t]=m;});
  return out;
}
function sortedWeak(weak){
  return Object.entries(weak).sort((a,b)=>b[1]-a[1]||T.indexOf(a[0])-T.indexOf(b[0]));
}
const weakTags=weak=>sortedWeak(weak).map(([t,m])=>`<span class="wt">${badge(t)}<b>${fmt(m)}</b></span>`).join('');

/* ---------- geradores de perguntas ---------- */
const ACCEPT={0:0.5,0.25:0.9,0.5:0.55,1:0.3,2:0.9,4:1};
function poolFor(diff){
  return POKE.filter(p=>diff==='facil'?p.t.length===1:diff==='dificil'?p.t.length===2:true);
}
function genAtaque(diff,seen){
  for(let i=0;i<500;i++){
    const atk=pick(T);
    const dual=diff==='dificil'||(diff==='medio'&&Math.random()<0.45);
    let defs,ex=null;
    if(dual){const d=pick(DUALS);defs=d.types;ex=d.ex;}else defs=[pick(T)];
    const m=mult(atk,defs);
    const key='a:'+atk+'>'+defs.join('/');
    if(seen.has(key))continue;
    if(Math.random()>ACCEPT[m])continue;
    seen.add(key);
    return {kind:'ataque',atk,defs,m,ex};
  }
  const atk=pick(T),defs=[pick(T)],m=mult(atk,defs);
  return {kind:'ataque',atk,defs,m,ex:null};
}
function pickMon(diff,seen){
  const pool=shuffle(poolFor(diff));
  const found=pool.find(p=>!seen.has('p:'+p.n))||pool[0];
  seen.add('p:'+found.n);
  return found;
}
function genFraquezas(diff,seen){
  const p=pickMon(diff,seen);
  const weak=weaknessOf(p);
  return {kind:'fraquezas',p,weak};
}
function genGolpe(diff,seen){
  const p=pickMon(diff,seen);
  const mults={};T.forEach(t=>mults[t]=mult(t,p.t));
  const best=Math.max(...Object.values(mults));
  const top=T.filter(t=>mults[t]===best);
  const correct=pick(top);
  const lower=shuffle(T.filter(t=>mults[t]<best));
  const options=shuffle([correct,...lower.slice(0,3)]);
  return {kind:'golpe',p,mults,best:correct,options};
}
const GEN={ataque:genAtaque,fraquezas:genFraquezas,golpe:genGolpe};
function buildGame(mode,diff){
  const seen=new Set();
  const kinds=mode==='misto'
    ?shuffle(['ataque','ataque','ataque','ataque','fraquezas','fraquezas','fraquezas','golpe','golpe','golpe'])
    :Array(10).fill(mode);
  return kinds.map(k=>GEN[k](diff,seen));
}

/* ---------- estado e armazenamento ---------- */
const S={screen:'menu',mode:null,diff:'medio',hide:false,qs:[],i:0,score:0,streak:0,bestStreak:0,
  answered:false,picked:null,sel:new Set(),results:[],study:'fogo',enter:true,focus:null,newRecord:false,clearArm:false,cleared:false,anchor:null};
try{
  const p=JSON.parse(localStorage.getItem('duelo-tipos:prefs')||'{}');
  if(['facil','medio','dificil'].includes(p.diff))S.diff=p.diff;
  S.hide=!!p.hide;
}catch(e){}
function savePrefs(){try{localStorage.setItem('duelo-tipos:prefs',JSON.stringify({diff:S.diff,hide:S.hide}));}catch(e){}}
function getBest(){try{return JSON.parse(localStorage.getItem('duelo-tipos:best')||'{}');}catch(e){return {};}}
function setBest(o){try{localStorage.setItem('duelo-tipos:best',JSON.stringify(o));}catch(e){}}

document.documentElement.style.setProperty('--spectrum','linear-gradient(90deg,'+T.map((t,i)=>`${COLOR[t]} ${(i*100/T.length).toFixed(2)}% ${((i+1)*100/T.length).toFixed(2)}%`).join(',')+')');

/* ---------- jogo ---------- */
function start(mode){
  S.mode=mode;S.qs=buildGame(mode,S.diff);S.i=0;S.score=0;S.streak=0;S.bestStreak=0;
  S.answered=false;S.picked=null;S.sel=new Set();S.results=[];S.screen='play';S.enter=true;S.newRecord=false;
  render();window.scrollTo(0,0);
}
function finishRound(state,partial){
  let pts=0;
  if(state==='ok'){pts=100+10*Math.min(S.streak,5);S.streak++;S.bestStreak=Math.max(S.bestStreak,S.streak);}
  else if(state==='part'){pts=partial;S.streak=0;}
  else S.streak=0;
  S.score+=pts;S.results[S.i]={state,pts};
}
function answer(val){
  if(S.answered||S.screen!=='play')return;
  const q=S.qs[S.i];
  const ok=q.kind==='ataque'?Number(val)===q.m:val===q.best;
  S.picked=val;S.answered=true;
  finishRound(ok?'ok':'no');
  S.focus='[data-act="next"]';render();
}
function verify(){
  const q=S.qs[S.i];
  if(S.answered||S.sel.size===0)return;
  const total=Object.keys(q.weak).length;
  let hits=0,wrong=0;
  S.sel.forEach(t=>{if(q.weak[t])hits++;else wrong++;});
  S.answered=true;
  if(hits===total&&wrong===0)finishRound('ok');
  else{const net=Math.max(0,hits-wrong);finishRound(net>0?'part':'no',Math.round(50*net/total));}
  S.focus='[data-act="next"]';render();
}
function next(){
  if(S.i+1>=S.qs.length){
    S.screen='result';
    const b=getBest(),key=S.mode+':'+S.diff;
    if(S.score>(b[key]||0)){b[key]=S.score;setBest(b);S.newRecord=true;}
    render();window.scrollTo(0,0);return;
  }
  S.i++;S.answered=false;S.picked=null;S.sel=new Set();S.enter=true;
  render();window.scrollTo(0,0);
}

/* ---------- telas ---------- */
const $app=document.getElementById('app');
/* Para onde cada tela volta. O menu é a raiz. */
const BACK={modes:'menu',options:'menu',how:'menu',study:'menu',play:'modes',result:'modes'};
const SVG='<svg viewBox="0 0 24 24" aria-hidden="true"';
const ICON={
  play:SVG+' fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  study:SVG+' fill="currentColor"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
  how:SVG+' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.6a2.6 2.6 0 015 .8c0 1.7-2.5 2-2.5 3.6M12 17.4v.01"/></svg>',
  options:SVG+' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h9M19 7h1M4 17h1M11 17h9"/><circle cx="16" cy="7" r="2.6"/><circle cx="8" cy="17" r="2.6"/></svg>',
  go:SVG+' fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  left:SVG+' fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>'
};

/* Anel com os 18 tipos: a marca do jogo. */
function ringSVG(){
  const n=T.length,R=104,r=66,gap=1.8,c=110;
  const pt=(rad,deg)=>{const a=(deg-90)*Math.PI/180;return [(c+rad*Math.cos(a)).toFixed(2),(c+rad*Math.sin(a)).toFixed(2)];};
  const paths=T.map((x,i)=>{
    const a0=i*360/n+gap/2,a1=(i+1)*360/n-gap/2;
    const [x0,y0]=pt(R,a0),[x1,y1]=pt(R,a1),[x2,y2]=pt(r,a1),[x3,y3]=pt(r,a0);
    return `<path d="M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z" fill="${COLOR[x]}"/>`;
  }).join('');
  return `<svg viewBox="0 0 220 220" aria-hidden="true">${paths}</svg>`;
}
/* Placa: um segmento de cor sólida com o nome do tipo. */
const sp=(t,eyebrow,grow)=>`<span class="p" style="--c:${COLOR[t]};--on:${ON[t]};--g:${grow||1}"><span class="in">${eyebrow?`<i>${eyebrow}</i>`:''}<b>${LABEL[t]}</b></span></span>`;
/* Segmento só de cor, para miniaturas pequenas demais para o nome. */
const spc=t=>`<span class="p" style="--c:${COLOR[t]}"></span>`;
const vsChip=()=>`<span class="vs" aria-hidden="true"><b>${tr('vs')}</b></span>`;

function go(screen,anchor){
  S.screen=screen;S.enter=true;S.anchor=anchor||null;S.focus='[data-first]';
  S.clearArm=false;S.cleared=false;
  render();
  if(!anchor)window.scrollTo(0,0);
}
function render(){
  document.documentElement.lang=LANG==='en'?'en':'pt-BR';
  document.title=tr('title');
  const views={menu:menuHTML,modes:modesHTML,options:optionsHTML,how:howHTML,study:studyHTML,play:playHTML,result:resultHTML};
  $app.innerHTML=`<div class="app">${barHTML()}<main class="screen${S.enter?' enter':''}" id="main">${views[S.screen]()}</main>${footHTML()}</div>`;
  if(S.focus){const el=$app.querySelector(S.focus);if(el&&el.focus)el.focus({preventScroll:true});S.focus=null;}
  if(S.anchor){const el=$app.querySelector('#'+S.anchor);if(el&&el.scrollIntoView)el.scrollIntoView();S.anchor=null;}
  S.enter=false;
}
function langSeg(big){
  const lb=(l,txt,ttl)=>`<button data-act="lang" data-val="${l}" aria-pressed="${LANG===l}" title="${ttl}" lang="${l==='pt'?'pt-BR':'en'}">${txt}</button>`;
  return `<div class="seg${big?' lg':''}" role="group" aria-label="${tr('langLabel')}">${lb('pt','PT','Português (Brasil)')}${lb('en','EN','English')}</div>`;
}
function barHTML(){
  const back=S.screen==='menu'?'':`<button class="back" data-act="back">${ICON.left}<span>${S.screen==='play'?tr('exit'):tr('back')}</span></button>`;
  return `<header class="bar">${back}<div class="tools">${langSeg(false)}</div></header>`;
}
function footHTML(){
  return `<footer class="foot"><p>${tr('legalShort')} <button class="link" data-act="legal">${tr('legalLink')}</button></p></footer>`;
}
function reviewHTML(q){
  if(q.kind==='ataque')return `${badge(q.atk)}<span class="ar">→</span>${q.defs.map(d=>badge(d)).join(' ')} <b>${fmt(q.m)}</b>`;
  const head=`<b>${q.p.name}</b> ${q.p.t.map(x=>badge(x)).join(' ')}<br>`;
  if(q.kind==='fraquezas')return head+weakTags(q.weak);
  return head+tr('revBest',badge(q.best),fmt(q.mults[q.best]));
}

/* --- menu inicial --- */
function menuHTML(){
  const items=[
    ['modes','fogo','play','navPlay','navPlayD'],
    ['study','agua','study','study','navStudyD'],
    ['how','planta','how','navHow','navHowD'],
    ['options','psiquico','options','navOpt','navOptD']
  ];
  const nav=items.map(([act,t,ico,n,d],i)=>`<button class="navitem" style="--c:${COLOR[t]};--on:${ON[t]};--i:${i}" data-act="go" data-val="${act}" ${i===0?'data-first':''}>
    <span class="ico">${ICON[ico]}</span><span class="txt"><b>${tr(n)}</b><small>${tr(d)}</small></span><span class="go">${ICON.go}</span></button>`).join('');
  return `<section class="menu">
    <div class="titleblock">
      <h1 class="title"><span>${tr('titleA')}</span><span>${tr('titleB')}</span></h1>
      <div class="spectrum" aria-hidden="true"></div>
      <p class="tag">${tr('tagline')}</p>
      <div class="plate demo" aria-hidden="true">${sp('agua',tr('move'))}${vsChip()}${sp('fogo',tr('defender'))}<span class="p neutral"><span class="in"><b>2×</b></span></span></div>
      <nav class="nav" aria-label="${tr('title')}">${nav}</nav>
    </div>
    <div class="ringwrap" aria-hidden="true">
      <div class="ring">${ringSVG()}</div>
      <div class="hub"><div class="row">${badge('agua')}${badge('fogo')}</div><div class="x">2×</div><small>${mlabel(2)}</small></div>
    </div>
  </section>`;
}

/* --- escolha do duelo --- */
function hideRow(){
  return `<label class="toggle-row"><span class="rtxt"><b>${tr('optHide')}</b><small>${tr('hide')}</small></span><input class="sw" type="checkbox" role="switch" id="hide" ${S.hide?'checked':''}></label>`;
}
function modesHTML(){
  const best=getBest(),M=D[LANG].modes;
  const plates={
    ataque:sp('agua')+sp('fogo'),
    fraquezas:sp('fantasma')+sp('veneno'),
    golpe:['eletrico','terra','voador','gelo'].map(spc).join(''),
    misto:['fogo','agua','planta','eletrico','psiquico','dragao'].map(spc).join('')
  };
  const lv=['facil','medio','dificil'].map(v=>`<button class="level" data-act="diff" data-val="${v}" aria-pressed="${S.diff===v}"><b>${D[LANG].diffs[v]}</b><small>${D[LANG].dd[v]}</small></button>`).join('');
  const cards=['ataque','fraquezas','golpe','misto'].map(id=>`<button class="mode" data-act="start" data-val="${id}">
    <span class="plate sm" aria-hidden="true">${plates[id]}</span>
    <span class="mname">${M[id].name}</span><span class="mdesc">${M[id].desc}</span>
    <span class="mrec">${tr('record')}<b>${best[id+':'+S.diff]||'—'}</b></span></button>`).join('');
  return `<section class="pickhead"><h1 class="h1" tabindex="-1" data-first>${tr('pickTitle')}</h1><p class="lede">${tr('pickSub')}</p></section>
  <section class="rows"><span class="eyebrow" id="dl">${tr('difficulty')}</span>
    <div class="levels" role="group" aria-labelledby="dl">${lv}</div>
    ${hideRow()}</section>
  <section class="modes">${cards}</section>`;
}

/* --- opções --- */
function optionsHTML(){
  const clear=S.clearArm?tr('clearSure'):tr('clear');
  return `<section class="pickhead"><h1 class="h1" tabindex="-1" data-first>${tr('navOpt')}</h1></section>
  <section class="rows">
    <div class="row-card"><span class="rtxt"><b>${tr('langLabel')}</b><small>Português (Brasil) · English</small></span>${langSeg(true)}</div>
    ${hideRow()}
    <div class="row-card"><span class="rtxt"><b>${tr('optRecords')}</b><small>${S.cleared?tr('cleared'):tr('optRecordsD')}</small></span>
      <button class="btn" data-act="clear">${clear}</button></div>
  </section>`;
}

/* --- como jogar e aviso legal --- */
function howHTML(){
  const M=D[LANG].modes,H=D[LANG];
  const modes=['ataque','fraquezas','golpe','misto'].map(id=>`<li><b>${M[id].name}.</b> ${M[id].desc}</li>`).join('');
  const mult=[4,2,1,0.5,0.25,0].map(m=>`<li><b>${fmt(m)}</b><span>${H.howMult[m]}</span></li>`).join('');
  return `<section class="pickhead"><h1 class="h1" tabindex="-1" data-first>${tr('navHow')}</h1><p class="lede">${tr('howGoal')}</p></section>
  <section class="howgrid">
    <div class="panel"><h2 class="h2">${tr('howModesT')}</h2><ul>${modes}</ul></div>
    <div class="panel"><h2 class="h2">${tr('howMultT')}</h2><ul class="mlist">${mult}</ul></div>
    <div class="panel"><h2 class="h2">${tr('howScoreT')}</h2><ul>${H.howScore.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="panel"><h2 class="h2">${tr('howKeysT')}</h2><p>${tr('howKeys')}</p></div>
  </section>
  <section class="panel" id="legal"><h2 class="h2">${tr('legalTitle')}</h2>
    <div class="legalbox"><p>${tr('legal1')}</p><p>${tr('legal2')}</p><p>${tr('legal3')}</p></div></section>`;
}

/* --- jogo --- */
function hudHTML(){
  const pips=S.qs.map((q,i)=>{const r=S.results[i];const c=r?r.state:(i===S.i?'cur':'');return `<span class="pip ${c}"></span>`;}).join('');
  return `<div class="hud"><div class="pips" role="img" aria-label="${tr('qAria',S.i+1,S.qs.length)}">${pips}</div>
  <div class="stats"><div class="stat"><small>${tr('points')}</small><b>${S.score}</b></div><div class="stat"><small>${tr('streak')}</small><b>${S.streak}</b></div></div></div>`;
}
function monHTML(p){
  const show=!S.hide||S.answered;
  return `<div class="monhead"><span class="dex">${dexNo(p.n)}</span><h2 class="monname">${p.name}</h2></div>
  <div class="plate low">${show?p.t.map(x=>sp(x)).join(''):`<span class="p unk"><span class="in"><b>${tr('hidden')}</b></span></span>`}</div>`;
}
function ataqueBody(q){
  const n=q.defs.length;
  const opts=MULTS.map((m,i)=>{
    let cls='opt';
    if(S.answered){if(m===q.m)cls+=' ok';else if(S.picked!==null&&Number(S.picked)===m)cls+=' no';else cls+=' dim';}
    return `<button class="${cls}" data-act="ans" data-val="${m}" ${S.answered?'disabled':''}><span class="big">${fmt(m)}</span><span class="sub">${mlabel(m)}</span><span class="k">${i+1}</span></button>`;
  }).join('');
  return `<div class="plate">${sp(q.atk,tr('move'),n)}${vsChip()}${q.defs.map((d,i)=>sp(d,i?'':tr('defender'),1)).join('')}</div>
  <p class="prompt">${tr('qMult')}</p><div class="dial">${opts}</div>`;
}
function golpeBody(q){
  const opts=q.options.map((x,i)=>{
    let cls='tbtn';
    if(S.answered){if(x===q.best)cls+=' ok';else if(S.picked===x)cls+=' no';else cls+=' dim';}
    return `<button class="${cls}" style="--c:${COLOR[x]};--on:${ON[x]}" data-act="ans" data-val="${x}" ${S.answered?'disabled':''}>${LABEL[x]}${S.answered?`<span class="m">${fmt(q.mults[x])}</span>`:`<span class="k">${i+1}</span>`}</button>`;
  }).join('');
  return `${monHTML(q.p)}<p class="prompt">${tr('qBest',q.p.name)}</p><div class="opts-types">${opts}</div>`;
}
function fraqBody(q){
  const n=Object.keys(q.weak).length;
  const chips=T.map(x=>{
    const sel=S.sel.has(x),w=q.weak[x];
    let st='',tag='';
    if(S.answered){
      if(sel&&w){st='ok';tag=fmt(w);}else if(sel&&!w){st='no';tag='✕';}else if(!sel&&w){st='miss';tag=fmt(w);}
    }
    return `<button class="chip" style="--c:${COLOR[x]};--on:${ON[x]}" data-act="toggle" data-val="${x}" aria-pressed="${sel}" ${st?`data-state="${st}"`:''} ${S.answered?'disabled':''}>${LABEL[x]}${tag?`<span class="tag">${tag}</span>`:''}</button>`;
  }).join('');
  return `${monHTML(q.p)}<p class="prompt">${tr('qWeak',q.p.name,n,S.diff==='facil')}</p>
  <div class="chips">${chips}</div>
  ${S.answered?'':`<div class="actions"><span class="hint">${tr('selected',S.sel.size)}</span><button class="btn primary" data-act="verify" ${S.sel.size?'':'disabled'}>${tr('verify')}</button></div>`}`;
}
function explainAtaque(q){
  const l=mlabel(q.m).toLowerCase();
  if(q.defs.length===1)return tr('exSingle',badge(q.atk),badge(q.defs[0]),fmt(q.m),l);
  const [a,b]=q.defs;
  return tr('exDual',badge(q.atk),badge(a),fmt(eff(q.atk,a)),badge(b),fmt(eff(q.atk,b)),fmt(q.m),l,q.ex);
}
function feedbackHTML(q,last){
  const r=S.results[S.i];
  let head,txt;
  if(q.kind==='ataque'){
    head=r.state==='ok'?tr('okHead'):tr('badHead');
    txt=explainAtaque(q);
  }else if(q.kind==='golpe'){
    head=r.state==='ok'?tr('okHead'):tr('badHead');
    txt=tr('exBest',q.p.name,badge(q.best),fmt(q.mults[q.best]))+`<br>${tr('weaknessesOf',q.p.name)} ${weakTags(weaknessOf(q.p))}`;
  }else{
    const total=Object.keys(q.weak).length;
    let hits=0;S.sel.forEach(x=>{if(q.weak[x])hits++;});
    head=r.state==='ok'?tr('perfect'):r.state==='part'?tr('almost',hits,total):tr('badHead');
    txt=tr('exWeak',q.p.name,q.p.t.map(x=>LABEL[x]).join(' / '))+`<br>${weakTags(q.weak)}`;
  }
  return `<div class="fb ${r.state}"><h3>${head}</h3><p>${txt}</p></div>
  <div class="actions"><span class="pts">${r.pts?tr('gain',r.pts):tr('noPts')}</span>
  <button class="btn primary" data-act="next">${last?tr('seeResult'):tr('next')}</button></div>`;
}
function playHTML(){
  const q=S.qs[S.i],last=S.i+1===S.qs.length;
  const mn=D[LANG].modes[q.kind].name;
  const body=q.kind==='ataque'?ataqueBody(q):q.kind==='fraquezas'?fraqBody(q):golpeBody(q);
  const keys=!S.answered&&q.kind!=='fraquezas'?`<p class="hint keys">${tr('keys',q.kind==='ataque'?6:4)}</p>`:'';
  return `${hudHTML()}
  <section class="stage${S.enter?' enter':''}">
    <span class="eyebrow">${tr('qLabel',S.i+1,S.qs.length,mn)}</span>
    ${body}${keys}
    <div id="fb" role="status">${S.answered?feedbackHTML(q,last):''}</div>
  </section>`;
}

/* --- resultado --- */
function resultHTML(){
  const n=S.qs.length,ok=S.results.filter(r=>r.state==='ok').length;
  const G=D[LANG].grades;
  const grade=ok===n?G[0]:ok>=8?G[1]:ok>=6?G[2]:ok>=4?G[3]:G[4];
  const MK=D[LANG].marks;
  const rows=S.qs.map((q,i)=>{
    const r=S.results[i]||{state:'no',pts:0};
    return `<li class="rv ${r.state}"><span class="mark" aria-label="${MK[r.state]}">${r.state==='ok'?'✓':r.state==='part'?'≈':'✕'}</span><div class="rvb">${reviewHTML(q)}</div><span class="pts">${r.pts?'+'+r.pts:'0'}</span></li>`;
  }).join('');
  return `<section class="scoreplate">
    <span class="eyebrow">${tr('result')} · ${D[LANG].modes[S.mode].name} · ${D[LANG].diffs[S.diff]}</span>
    <div class="score-big" tabindex="-1" data-first>${S.score}</div><p class="grade">${grade}</p>
    ${S.newRecord?`<span class="newrec">${tr('newRecord')}</span>`:''}
    <div class="facts"><div class="stat"><small>${tr('hits')}</small><b>${tr('of',ok,n)}</b></div><div class="stat"><small>${tr('bestStreak')}</small><b>${S.bestStreak}</b></div></div>
    <div class="actions start"><button class="btn primary" data-act="start" data-val="${S.mode}">${tr('again')}</button><button class="btn" data-act="go" data-val="modes">${tr('changeMode')}</button><button class="btn" data-act="go" data-val="menu">${tr('toMenu')}</button></div>
  </section>
  <section class="panel"><h2 class="h2">${tr('review')}</h2><ul class="rvlist">${rows}</ul></section>`;
}

/* --- estudar tipos --- */
function studyHTML(){
  const ty=S.study,c=CHART[ty];
  const chips=T.map(x=>`<button class="chip" style="--c:${COLOR[x]};--on:${ON[x]}" data-act="studytype" data-val="${x}" aria-pressed="${x===ty}">${LABEL[x]}</button>`).join('');
  const tags=(arr,m)=>arr.length?arr.map(x=>`<span class="wt">${badge(x)}<b>${m}</b></span>`).join(''):`<span class="hint">${tr('none')}</span>`;
  const weakTo=T.filter(a=>CHART[a].se.includes(ty)),resists=T.filter(a=>CHART[a].nve.includes(ty)),immune=T.filter(a=>CHART[a].imm.includes(ty));
  const line=(title,arr,m)=>`<div class="line"><span class="eyebrow">${title}</span><div class="tags">${tags(arr,m)}</div></div>`;
  let h=`<table><caption class="sr">${tr('caption')}</caption><thead><tr><th class="corner">${tr('corner')}</th>`;
  h+=T.map(d=>`<th class="col" style="--c:${COLOR[d]};--on:${ON[d]}" title="${LABEL[d]}">${abbr(d)}</th>`).join('')+'</tr></thead><tbody>';
  T.forEach(a=>{
    h+=`<tr><th class="row" style="--c:${COLOR[a]};--on:${ON[a]}">${LABEL[a]}</th>`+T.map(d=>{
      const e=eff(a,d),cls=e===2?'se':e===0.5?'nve':e===0?'imm':'';
      const txt=e===2?'2':e===0.5?'½':e===0?'0':'';
      return `<td class="${cls}${a===ty||d===ty?' hl':''}" title="${tr('cell',LABEL[a],LABEL[d],fmt(e))}">${txt}</td>`;
    }).join('')+'</tr>';
  });
  h+='</tbody></table>';
  return `<section class="pickhead"><h1 class="h1" tabindex="-1" data-first>${tr('study')}</h1><p class="lede">${tr('studyLede')}</p></section>
  <div class="chips">${chips}</div>
  <div class="plate big">${sp(ty)}</div>
  <div class="cols">
    <div class="panel grp"><h3>${tr('attackingWith',badge(ty))}</h3>${line(tr('seLine'),c.se,'2×')}${line(tr('nveLine'),c.nve,'½×')}${line(tr('immLine'),c.imm,'0×')}</div>
    <div class="panel grp"><h3>${tr('defendingAs',badge(ty))}</h3>${line(tr('weakTo'),weakTo,'2×')}${line(tr('resists'),resists,'½×')}${line(tr('immuneTo'),immune,'0×')}</div>
  </div>
  <section style="display:flex;flex-direction:column;gap:12px"><h2 class="h2">${tr('fullTable')}</h2>
    <div class="legend"><span><i class="sw2" style="background:var(--good-bg);color:var(--good)">2</i>${tr('lgSe')}</span><span><i class="sw2" style="background:var(--bad-bg);color:var(--bad)">½</i>${tr('lgNve')}</span><span><i class="sw2" style="background:var(--ink);color:var(--bg)">0</i>${tr('lgImm')}</span><span>${tr('lgNormal')}</span></div>
    <div class="scroll">${h}</div></section>`;
}

/* ---------- eventos ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');
  if(!el||el.disabled)return;
  const a=el.dataset.act,v=el.dataset.val;
  if(a!=='clear'){S.clearArm=false;S.cleared=false;}
  if(a==='go')go(v);
  else if(a==='back')go(BACK[S.screen]||'menu');
  else if(a==='legal')go('how','legal');
  else if(a==='lang'){setLang(v);S.focus=`[data-act="lang"][data-val="${v}"]`;render();}
  else if(a==='diff'){S.diff=v;savePrefs();S.focus=`[data-act="diff"][data-val="${v}"]`;render();}
  else if(a==='start')start(v);
  else if(a==='ans')answer(v);
  else if(a==='toggle'){
    if(S.answered)return;
    if(S.sel.has(v))S.sel.delete(v);else S.sel.add(v);
    S.focus=`[data-act="toggle"][data-val="${v}"]`;render();
  }
  else if(a==='verify')verify();
  else if(a==='next')next();
  else if(a==='studytype'){S.study=v;S.focus=`[data-act="studytype"][data-val="${v}"]`;render();}
  else if(a==='clear'){
    if(!S.clearArm){S.clearArm=true;S.cleared=false;}
    else{setBest({});S.clearArm=false;S.cleared=true;}
    S.focus='[data-act="clear"]';render();
  }
});
document.addEventListener('change',e=>{
  if(e.target&&e.target.id==='hide'){S.hide=e.target.checked;savePrefs();}
});
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.key==='Escape'&&S.screen!=='menu'){go(BACK[S.screen]||'menu');return;}
  if(S.screen!=='play')return;
  const q=S.qs[S.i];
  if(e.key==='Enter'){
    if(S.answered){e.preventDefault();next();}
    else if(q.kind==='fraquezas'){e.preventDefault();verify();}
    return;
  }
  if(!S.answered&&/^[1-6]$/.test(e.key)){
    const k=Number(e.key)-1;
    if(q.kind==='ataque')answer(MULTS[k]);
    else if(q.kind==='golpe'&&k<4)answer(q.options[k]);
  }
});

render();
