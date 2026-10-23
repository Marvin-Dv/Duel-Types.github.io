/* Duelo de Tipos: lógica do jogo.
   Seções, em ordem: dados e tabela de tipos, idioma (i18n), utilidades, geradores de perguntas,
   estado e armazenamento, regras do jogo, telas, eventos. */

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
  study:'Estudar tipos', back:'Voltar ao jogo',
  lede:'Teste o que você sabe sobre vantagens e fraquezas dos tipos Pokémon. Cada partida tem 10 perguntas, e cada resposta vem com a explicação.',
  difficulty:'Dificuldade', diffs:{facil:'Fácil',medio:'Médio',dificil:'Difícil'},
  dd:{facil:'Só tipos únicos. Os Pokémon e os defensores têm um tipo só.',medio:'Mistura tipos únicos e duplos.',dificil:'Só tipos duplos. Os multiplicadores 4× e ¼× entram em jogo.'},
  hide:'Ocultar os tipos do Pokémon nos modos com Pokémon. Você precisa saber quais são.',
  chooseMode:'Escolha um modo',
  modes:{
    ataque:{name:'Ataque',desc:'Um tipo ataca outro. Qual é o multiplicador de dano?'},
    fraquezas:{name:'Fraquezas',desc:'Veja um Pokémon e marque todos os tipos que causam dano extra nele.'},
    golpe:{name:'Melhor golpe',desc:'Quatro tipos de golpe, só um é o mais efetivo contra o Pokémon.'},
    misto:{name:'Treino misto',desc:'Os três modos embaralhados em uma só partida.'}
  },
  mixPrev:'Ataque · Fraquezas · Melhor golpe', record:'Recorde: ',
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
  legal1:'<strong>Projeto de fã, gratuito e sem fins lucrativos.</strong> Este site não é afiliado, patrocinado, aprovado nem endossado pela Nintendo, pela Creatures Inc. ou pela GAME FREAK inc.',
  legal2:'Pokémon, os nomes dos Pokémon e dos tipos e os demais elementos relacionados são marcas registradas e propriedade da Nintendo, Creatures Inc. e GAME FREAK inc. © Nintendo / Creatures Inc. / GAME FREAK inc. Todos os direitos reservados aos seus respectivos titulares.',
  legal3:'Este jogo não usa imagens, sprites, logotipos, músicas nem outros materiais oficiais. Os nomes são citados apenas para identificar os personagens, com finalidade educativa.'
},
en:{
  title:'Type Duel', dexPre:'No. ', langLabel:'Language',
  study:'Study types', back:'Back to game',
  lede:'Test what you know about Pokémon type matchups and weaknesses. Each round has 10 questions, and every answer comes with an explanation.',
  difficulty:'Difficulty', diffs:{facil:'Easy',medio:'Medium',dificil:'Hard'},
  dd:{facil:'Single types only. Pokémon and defenders have just one type.',medio:'A mix of single and dual types.',dificil:'Dual types only. The 4× and ¼× multipliers come into play.'},
  hide:'Hide the Pokémon’s types in modes that show a Pokémon. You have to know them.',
  chooseMode:'Choose a mode',
  modes:{
    ataque:{name:'Attack',desc:'One type attacks another. What is the damage multiplier?'},
    fraquezas:{name:'Weaknesses',desc:'See a Pokémon and mark every type that deals extra damage to it.'},
    golpe:{name:'Best move',desc:'Four move types, only one is the most effective against the Pokémon.'},
    misto:{name:'Mixed training',desc:'All three modes shuffled into a single round.'}
  },
  mixPrev:'Attack · Weaknesses · Best move', record:'Best: ',
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
const S={screen:'home',mode:null,diff:'medio',hide:false,qs:[],i:0,score:0,streak:0,bestStreak:0,
  answered:false,picked:null,sel:new Set(),results:[],study:'fogo',enter:false,focus:null,newRecord:false};
try{
  const p=JSON.parse(localStorage.getItem('duelo-tipos:prefs')||'{}');
  if(['facil','medio','dificil'].includes(p.diff))S.diff=p.diff;
  S.hide=!!p.hide;
}catch(e){}
function savePrefs(){try{localStorage.setItem('duelo-tipos:prefs',JSON.stringify({diff:S.diff,hide:S.hide}));}catch(e){}}
function getBest(){try{return JSON.parse(localStorage.getItem('duelo-tipos:best')||'{}');}catch(e){return {};}}
function setBest(o){try{localStorage.setItem('duelo-tipos:best',JSON.stringify(o));}catch(e){}}

document.documentElement.style.setProperty('--wheel',
  'conic-gradient('+T.map((t,i)=>`${COLOR[t]} ${(i*100/18).toFixed(2)}% ${((i+1)*100/18).toFixed(2)}%`).join(',')+')');

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
function render(){
  document.documentElement.lang=LANG==='en'?'en':'pt-BR';
  document.title=tr('title');
  let html;
  if(S.screen==='home')html=homeHTML();
  else if(S.screen==='play')html=playHTML();
  else if(S.screen==='result')html=resultHTML();
  else html=studyHTML();
  $app.innerHTML=`<div class="wrap">${headerHTML()}${html}${legalHTML()}</div>`;
  if(S.focus){const el=$app.querySelector(S.focus);if(el)el.focus();S.focus=null;}
  S.enter=false;
}
function reviewHTML(q){
  if(q.kind==='ataque')return `${badge(q.atk)}<span class="ar">→</span>${q.defs.map(d=>badge(d)).join(' ')} <b>${fmt(q.m)}</b>`;
  const head=`<b>${q.p.name}</b> ${q.p.t.map(x=>badge(x)).join(' ')}<br>`;
  if(q.kind==='fraquezas')return head+weakTags(q.weak);
  return head+tr('revBest',badge(q.best),fmt(q.mults[q.best]));
}
function legalHTML(){
  return `<footer class="legal"><p>${tr('legal1')}</p><p>${tr('legal2')}</p><p>${tr('legal3')}</p></footer>`;
}
function headerHTML(){
  const study=S.screen==='study';
  const lb=(l,txt,ttl)=>`<button data-act="lang" data-val="${l}" aria-pressed="${LANG===l}" title="${ttl}" lang="${l==='pt'?'pt-BR':'en'}">${txt}</button>`;
  return `<header class="top"><button class="brand" data-act="home"><span class="wheel" aria-hidden="true"></span>${tr('title')}</button>
  <div class="tools"><div class="seg sm" role="group" aria-label="${tr('langLabel')}">${lb('pt','PT','Português (Brasil)')}${lb('en','EN','English')}</div>
  <button class="btn sm" data-act="${study?'home':'study'}">${study?tr('back'):tr('study')}</button></div></header>`;
}

function homeHTML(){
  const best=getBest();
  const M=D[LANG].modes;
  const modes=[
    {id:'ataque',prev:`${badge('agua')}${ARROW.replace('class="arrow"','class="arrow" style="width:28px;height:18px"')}${badge('fogo')}<span class="mini-mult">?</span>`},
    {id:'fraquezas',prev:`<span class="dex">${dexNo(94)}</span><b>Gengar</b>${badge('fantasma')}${badge('veneno')}`},
    {id:'golpe',prev:['eletrico','terra','voador','gelo'].map(x=>badge(x)).join('')},
    {id:'misto',prev:`<span class="hint">${tr('mixPrev')}</span>`}
  ];
  return `
  <section class="hero">
    <h1>${tr('title')}</h1>
    <p class="lede">${tr('lede')}</p>
    <div class="strip" aria-hidden="true">${badge('agua','lg')}${ARROW}${badge('fogo','lg')}<span class="mult">2×</span><span class="cap">${mlabel(2)}</span></div>
  </section>
  <section class="card settings">
    <div class="field"><span class="eyebrow" id="dl">${tr('difficulty')}</span>
      <div class="seg" role="group" aria-labelledby="dl">${['facil','medio','dificil'].map(v=>`<button data-act="diff" data-val="${v}" aria-pressed="${S.diff===v}">${D[LANG].diffs[v]}</button>`).join('')}</div>
      <p class="hint">${D[LANG].dd[S.diff]}</p></div>
    <label class="check"><input type="checkbox" id="hide" ${S.hide?'checked':''}><span>${tr('hide')}</span></label>
  </section>
  <section><h2 class="h2">${tr('chooseMode')}</h2>
    <div class="modes">${modes.map(m=>`<button class="mode" data-act="start" data-val="${m.id}">
      <span class="prev">${m.prev}</span><span class="name">${M[m.id].name}</span><span class="desc">${M[m.id].desc}</span>
      <span class="rec">${tr('record')}${best[m.id+':'+S.diff]||'—'}</span></button>`).join('')}</div>
  </section>`;
}

function hudHTML(){
  const pips=S.qs.map((q,i)=>{const r=S.results[i];const c=r?r.state:(i===S.i?'cur':'');return `<span class="pip ${c}"></span>`;}).join('');
  return `<div class="hud"><div class="pips" role="img" aria-label="${tr('qAria',S.i+1,S.qs.length)}">${pips}</div>
  <div class="stats"><div class="stat"><small>${tr('points')}</small><b>${S.score}</b></div><div class="stat"><small>${tr('streak')}</small><b>${S.streak}</b></div></div></div>`;
}
function monHTML(p){
  const show=!S.hide||S.answered;
  return `<div class="mon"><span class="dex">${dexNo(p.n)}</span><h2>${p.name}</h2></div>
  <div class="types">${show?p.t.map(x=>badge(x)).join(''):`<span class="tb unk">${tr('hidden')}</span>`}</div>`;
}
function ataqueBody(q){
  const opts=MULTS.map((m,i)=>{
    let cls='opt';
    if(S.answered){if(m===q.m)cls+=' ok';else if(S.picked!==null&&Number(S.picked)===m)cls+=' no';else cls+=' dim';}
    return `<button class="${cls}" data-act="ans" data-val="${m}" ${S.answered?'disabled':''}><span class="big">${fmt(m)}</span><span class="sub">${mlabel(m)}</span><span class="k">${i+1}</span></button>`;
  }).join('');
  return `<div class="duel"><div class="side"><span class="eyebrow">${tr('move')}</span>${badge(q.atk,'lg')}</div>${ARROW}
  <div class="side"><span class="eyebrow">${tr('defender')}</span>${q.defs.map(d=>badge(d,'lg')).join('')}</div></div>
  <p class="prompt">${tr('qMult')}</p><div class="opts mult">${opts}</div>`;
}
function golpeBody(q){
  const opts=q.options.map((x,i)=>{
    let cls='topt';
    if(S.answered){if(x===q.best)cls+=' ok';else if(S.picked===x)cls+=' no';else cls+=' dim';}
    return `<button class="${cls}" style="--c:${COLOR[x]};--on:${ON[x]}" data-act="ans" data-val="${x}" ${S.answered?'disabled':''}>${LABEL[x]}${S.answered?`<span class="m">${fmt(q.mults[x])}</span>`:`<span class="k">${i+1}</span>`}</button>`;
  }).join('');
  return `${monHTML(q.p)}<p class="prompt">${tr('qBest',q.p.name)}</p><div class="opts types">${opts}</div>`;
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
  <section class="card stage${S.enter?' enter':''}">
    <div class="qtop"><span class="eyebrow">${tr('qLabel',S.i+1,S.qs.length,mn)}</span><button class="link" data-act="home">${tr('exit')}</button></div>
    ${body}${keys}
    <div id="fb" role="status">${S.answered?feedbackHTML(q,last):''}</div>
  </section>`;
}

function resultHTML(){
  const n=S.qs.length,ok=S.results.filter(r=>r.state==='ok').length;
  const G=D[LANG].grades;
  const grade=ok===n?G[0]:ok>=8?G[1]:ok>=6?G[2]:ok>=4?G[3]:G[4];
  const MK=D[LANG].marks;
  const rows=S.qs.map((q,i)=>{
    const r=S.results[i]||{state:'no',pts:0};
    return `<li class="rv ${r.state}"><span class="mark" aria-label="${MK[r.state]}">${r.state==='ok'?'✓':r.state==='part'?'≈':'✕'}</span><div class="rvb">${reviewHTML(q)}</div><span class="pts">${r.pts?'+'+r.pts:'0'}</span></li>`;
  }).join('');
  return `<section class="card stage">
    <span class="eyebrow">${tr('result')} · ${D[LANG].modes[S.mode].name}</span>
    <div><div class="score-big">${S.score}</div><p class="grade">${grade}</p></div>
    ${S.newRecord?`<span class="newrec">${tr('newRecord')}</span>`:''}
    <div class="facts"><div class="stat"><small>${tr('hits')}</small><b>${tr('of',ok,n)}</b></div><div class="stat"><small>${tr('bestStreak')}</small><b>${S.bestStreak}</b></div></div>
    <div class="actions"><button class="btn primary" data-act="start" data-val="${S.mode}">${tr('again')}</button><button class="btn" data-act="home">${tr('changeMode')}</button></div>
  </section>
  <section class="card"><h2 class="h2">${tr('review')}</h2><ul class="rvlist">${rows}</ul></section>`;
}

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
  return `<section class="hero"><h1>${tr('study')}</h1><p class="lede">${tr('studyLede')}</p></section>
  <section class="card" style="display:flex;flex-direction:column;gap:18px">
    <div class="chips">${chips}</div>
    <div class="cols">
      <div class="grp"><h3>${tr('attackingWith',badge(ty))}</h3>${line(tr('seLine'),c.se,'2×')}${line(tr('nveLine'),c.nve,'½×')}${line(tr('immLine'),c.imm,'0×')}</div>
      <div class="grp"><h3>${tr('defendingAs',badge(ty))}</h3>${line(tr('weakTo'),weakTo,'2×')}${line(tr('resists'),resists,'½×')}${line(tr('immuneTo'),immune,'0×')}</div>
    </div>
  </section>
  <section style="display:flex;flex-direction:column;gap:12px"><h2 class="h2" style="margin:0">${tr('fullTable')}</h2>
    <div class="legend"><span><i class="sw" style="background:var(--good-bg);color:var(--good)">2</i>${tr('lgSe')}</span><span><i class="sw" style="background:var(--bad-bg);color:var(--bad)">½</i>${tr('lgNve')}</span><span><i class="sw" style="background:var(--ink);color:var(--bg)">0</i>${tr('lgImm')}</span><span>${tr('lgNormal')}</span></div>
    <div class="scroll">${h}</div></section>`;
}

/* ---------- eventos ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');
  if(!el||el.disabled)return;
  const a=el.dataset.act,v=el.dataset.val;
  if(a==='home'){S.screen='home';render();window.scrollTo(0,0);}
  else if(a==='study'){S.screen='study';render();window.scrollTo(0,0);}
  else if(a==='lang'){setLang(v);S.focus=`[data-act="lang"][data-val="${v}"]`;render();}
  else if(a==='start')start(v);
  else if(a==='diff'){S.diff=v;savePrefs();S.focus=`[data-act="diff"][data-val="${v}"]`;render();}
  else if(a==='ans')answer(v);
  else if(a==='toggle'){
    if(S.answered)return;
    if(S.sel.has(v))S.sel.delete(v);else S.sel.add(v);
    S.focus=`[data-act="toggle"][data-val="${v}"]`;render();
  }
  else if(a==='verify')verify();
  else if(a==='next')next();
  else if(a==='studytype'){S.study=v;S.focus=`[data-act="studytype"][data-val="${v}"]`;render();}
});
document.addEventListener('change',e=>{
  if(e.target&&e.target.id==='hide'){S.hide=e.target.checked;savePrefs();}
});
document.addEventListener('keydown',e=>{
  if(S.screen!=='play'||e.metaKey||e.ctrlKey||e.altKey)return;
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
