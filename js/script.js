const SERVICES=[
  {id:'aval',n:'Avaliação geral',d:'30 min · exame e plano de tratamento',p:'R$ 120'},
  {id:'limp',n:'Limpeza e profilaxia',d:'45 min · remoção de tártaro e polimento',p:'R$ 180'},
  {id:'clar',n:'Clareamento',d:'60 min · sessão em consultório',p:'R$ 650'},
  {id:'orto',n:'Manutenção de aparelho',d:'30 min · ajuste ortodôntico',p:'R$ 150'},
  {id:'urg',n:'Urgência',d:'30 min · dor, fratura ou inchaço',p:'R$ 200'}
];
const DENTISTS=['Sem preferência','Dra. Helena Prado (clínica geral)','Dr. Rafael Moura (ortodontia)','Dra. Camila Duarte (estética)'];
const $=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,'0');
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmt=k=>{const[y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})};
const today=new Date();today.setHours(0,0,0,0);
let st={service:null,dentist:0,date:null,time:null};
let view=new Date(today.getFullYear(),today.getMonth(),1);

/* armazenamento seguro */
function load(){try{return JSON.parse(localStorage.getItem('sc-appts')||'[]')}catch(e){return []}}
function save(a){try{localStorage.setItem('sc-appts',JSON.stringify(a))}catch(e){}}
let mem=load();

/* horários */
function baseSlots(d){
  const w=d.getDay(); if(w===0) return [];
  const end=w===6?12:18, out=[];
  for(let h=8;h<end;h++){out.push(`${pad(h)}:00`);out.push(`${pad(h)}:30`)}
  return out;
}
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h}
function taken(k,t){
  if(mem.some(a=>a.date===k&&a.time===t))return true;
  return hash(k+t)%10<3; // simula agenda já ocupada
}
function freeSlots(d){
  const k=key(d), now=new Date();
  return baseSlots(d).filter(t=>{
    if(d.getTime()===today.getTime()){const[h,m]=t.split(':').map(Number);if(h*60+m<=now.getHours()*60+now.getMinutes()+30)return false}
    return !taken(k,t);
  });
}

/* etapas */
function go(n){
  ['s1','s2','s3','s4'].forEach((id,i)=>$('#'+id).hidden=(i+1!==n));
  document.querySelectorAll('#steps li').forEach((li,i)=>li.classList.toggle('on',i<Math.min(n,3)));
  $('#steps').hidden=n===4;
  if(n===3)renderResume();
  $('#agenda').scrollIntoView({block:'nearest'});
}

/* etapa 1 */
function renderServices(){
  $('#services').innerHTML=SERVICES.map(s=>`
    <button type="button" class="opt" data-id="${s.id}" aria-pressed="${st.service===s.id}">
      <span><strong>${s.n}</strong><small>${s.d}</small></span><span class="price">${s.p}</span>
    </button>`).join('');
}
$('#services').addEventListener('click',e=>{
  const b=e.target.closest('.opt');if(!b)return;
  st.service=b.dataset.id;renderServices();$('#n1').disabled=false;
});
$('#dentist').innerHTML=DENTISTS.map((d,i)=>`<option value="${i}">${d}</option>`).join('');
$('#dentist').onchange=e=>st.dentist=+e.target.value;
$('#n1').onclick=()=>{go(2);renderCal()};

/* etapa 2 */
function renderCal(){
  const y=view.getFullYear(),m=view.getMonth();
  $('#monthLabel').textContent=view.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const maxView=new Date(today.getFullYear(),today.getMonth()+3,1);
  $('#prev').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
  $('#next').disabled=view>=maxView;
  let h=['dom','seg','ter','qua','qui','sex','sáb'].map(d=>`<div class="dow">${d}</div>`).join('');
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  h+='<div></div>'.repeat(first);
  for(let d=1;d<=days;d++){
    const dt=new Date(y,m,d), k=key(dt);
    const off=dt<today||freeSlots(dt).length===0||dt>new Date(today.getFullYear(),today.getMonth()+3,today.getDate());
    h+=`<button type="button" class="day${dt.getTime()===today.getTime()?' today':''}" data-k="${k}" ${off?'disabled':''} aria-pressed="${st.date===k}" aria-label="${fmt(k)}">${d}</button>`;
  }
  $('#cal').innerHTML=h;
}
$('#prev').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);renderCal()};
$('#next').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);renderCal()};
$('#cal').addEventListener('click',e=>{
  const b=e.target.closest('.day');if(!b||b.disabled)return;
  st.date=b.dataset.k;st.time=null;$('#n2').disabled=true;renderCal();renderSlots();
});
function renderSlots(){
  const [y,m,d]=st.date.split('-').map(Number);
  const free=freeSlots(new Date(y,m-1,d));
  $('#slotsLabel').hidden=false;
  $('#slotsLabel').textContent=`Horários em ${fmt(st.date)}`;
  $('#slots').innerHTML=free.map(t=>`<button type="button" class="slot" data-t="${t}" aria-pressed="${st.time===t}">${t}</button>`).join('');
}
$('#slots').addEventListener('click',e=>{
  const b=e.target.closest('.slot');if(!b)return;
  st.time=b.dataset.t;$('#n2').disabled=false;renderSlots();
});
$('#n2').onclick=()=>go(3);
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>go(+b.dataset.back));

/* etapa 3 */
function renderResume(){
  const s=SERVICES.find(x=>x.id===st.service);
  $('#resume').innerHTML=`
    <div><span>Consulta</span><strong>${s.n}</strong></div>
    <div><span>Dentista</span><strong>${DENTISTS[st.dentist].split(' (')[0]}</strong></div>
    <div><span>Data</span><strong>${fmt(st.date)}</strong></div>
    <div><span>Horário</span><strong>${st.time}</strong></div>`;
}
$('#phone').addEventListener('input',e=>{
  let v=e.target.value.replace(/\D/g,'').slice(0,11);
  if(v.length>6)v=v.length>10?`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`:`(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  else if(v.length>2)v=`(${v.slice(0,2)}) ${v.slice(2)}`;
  e.target.value=v;
});
function validate(){
  const n=$('#name').value.trim(), p=$('#phone').value.replace(/\D/g,''), em=$('#email').value.trim();
  const eN=n.split(/\s+/).length<2||n.length<5?'Informe nome e sobrenome.':'';
  const eP=p.length<10?'Informe o celular com DDD.':'';
  const eE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)?'':'Informe um e-mail válido, como nome@email.com.';
  $('#eName').textContent=eN;$('#ePhone').textContent=eP;$('#eEmail').textContent=eE;
  return !(eN||eP||eE);
}
$('#confirm').onclick=()=>{
  if(!validate())return;
  const code=Array.from({length:6},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
  const s=SERVICES.find(x=>x.id===st.service);
  mem.push({code,service:s.n,dentist:DENTISTS[st.dentist].split(' (')[0],date:st.date,time:st.time,name:$('#name').value.trim()});
  save(mem);
  $('#doneText').textContent=`${s.n}, ${fmt(st.date)}, às ${st.time}. Enviaremos a confirmação para ${$('#email').value.trim()}.`;
  $('#doneCode').textContent=code;
  go(4);renderList();
};
$('#again').onclick=()=>{
  st={service:null,dentist:0,date:null,time:null};
  ['name','phone','email'].forEach(i=>$('#'+i).value='');
  $('#dentist').value=0;$('#n1').disabled=true;$('#n2').disabled=true;
  $('#slots').innerHTML='';$('#slotsLabel').hidden=true;
  renderServices();go(1);
};

/* minhas consultas */
function renderList(){
  const up=mem.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $('#list').innerHTML=up.length?up.map(a=>`
    <div class="appt">
      <div><strong>${a.service}</strong><br><small>${fmt(a.date)}, ${a.time} · ${a.dentist} · código ${a.code}</small></div>
      <button type="button" data-c="${a.code}">Cancelar</button>
    </div>`).join(''):'<div class="empty">Você ainda não tem consultas agendadas. Use o formulário acima para marcar a primeira.</div>';
}
$('#list').addEventListener('click',e=>{
  const b=e.target.closest('button[data-c]');if(!b)return;
  if(!confirm('Cancelar esta consulta?'))return;
  mem=mem.filter(a=>a.code!==b.dataset.c);save(mem);renderList();
  if(st.date&&!$('#s2').hidden){renderCal();renderSlots()}
});

renderServices();go(1);renderList();
