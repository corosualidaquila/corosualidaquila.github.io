    const examples = [
      "Laudato sii, o mi’ Signore","Servo per amore","Symbolum ’77 (Tu sei la mia vita)",
      "Camminerò","Alleluia, canta all’Alleluia","Come fuoco vivo","Acqua siamo noi",
      "Andate per le strade","Vivere la vita","Su ali d’aquila"
    ];
    const challenges = [
      "Cantiamo il ritornello accompagnandolo con un gesto inventato da voi.",
      "Dividiamoci in due gruppi: uno canta, l’altro risponde nel ritornello!",
      "Un bambino dirige: sceglie quando cantare piano e quando a voce piena.",
      "Proviamo a cantare il ritornello con un ritmo battuto piano sulle gambe.",
      "Prima di iniziare, ognuno dice una parola bella che il canto gli fa venire in mente.",
      "Cantiamo la prima volta sottovoce e la seconda con tutta la nostra energia!",
      "Inventiamo insieme un movimento semplice per il ritornello.",
      "Facciamo un respiro tutti insieme e iniziamo come un vero coro!"
    ];
    const eagleMascot = `<img src="assets/armon-direttore.png" alt="Armon direttore d'orchestra" draggable="false">`;
    const $ = id => document.getElementById(id);
    let darkTheme=false;try{darkTheme=localStorage.getItem('missione-note-theme')==='dark'}catch{}
    function applyTheme(isDark,save=false){darkTheme=isDark;document.documentElement.dataset.theme=isDark?'dark':'light';$('theme-toggle').setAttribute('aria-pressed',String(isDark));$('theme-toggle').setAttribute('aria-label',isDark?'Attiva il tema chiaro':'Attiva il tema scuro');$('brand-logo').src=isDark?'assets/logo-su-d-aquila-dark.png':'assets/logo-su-d-aquila-light.png';document.querySelector('meta[name="theme-color"]').content=isDark?'#111827':'#f6c95c';if(save){try{localStorage.setItem('missione-note-theme',isDark?'dark':'light')}catch{}}}
    applyTheme(darkTheme);
    $('theme-toggle').addEventListener('click',()=>applyTheme(!darkTheme,true));
    function showView(viewId){document.querySelectorAll('.page-view').forEach(view=>{view.hidden=view.id!==viewId});document.querySelectorAll('[data-view]').forEach(button=>{const selected=button.dataset.view===viewId;button.classList.toggle('is-active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});$('home-return').hidden=viewId==='home-view';$('note-guide-message').hidden=true}
    document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));
    let songs = loadSongs(), lastSong = "", busy = false;
    function loadSongs(){try{const saved=JSON.parse(localStorage.getItem("missione-note-songs"));return Array.isArray(saved)&&saved.length?saved:examples.slice()}catch{return examples.slice()}}
    function renderSongs(){ $('song-list').innerHTML=songs.map((song,i)=>`<button class="song" type="button" data-song-index="${i}" aria-label="Scegli ${escapeHtml(song)}"><span class="num">${i+1}</span><span>${escapeHtml(song)}</span></button>`).join('');$('song-input').value=songs.join('\n');const select=$('karaoke-song'),previous=select.value;select.innerHTML=songs.map(song=>`<option value="${escapeHtml(song)}">${escapeHtml(song)}</option>`).join('');if(songs.includes(previous))select.value=previous;loadLyricsForSong() }
    function getLyrics(){try{return JSON.parse(localStorage.getItem('missione-note-lyrics')||'{}')}catch{return {}}}
    let lyricsStore=getLyrics();
    function loadLyricsForSong(){$('lyrics-input').value=lyricsStore[$('karaoke-song').value]||''}
    async function persistLyrics(){localStorage.setItem('missione-note-lyrics',JSON.stringify(lyricsStore));try{const response=await fetch('/api/lyrics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lyricsStore)});return response.ok}catch{return false}}
    let karaokeLines=[],karaokeIndex=0;
    function groupLyrics(text){const slides=[];let group=[],phrases=0,size=0,pendingBreak=false;const flush=()=>{if(phrases){slides.push(group.join('\n'));group=[];phrases=0;size=0;pendingBreak=false}};for(const raw of text.split(/\r?\n/)){const line=raw.trim();if(!line){if(phrases)pendingBreak=true;continue}const nextSize=size+line.length+1;if(phrases>=5&&(phrases>=6||nextSize>300))flush();if(pendingBreak&&phrases)group.push('');group.push(line);phrases++;size+=line.length+1;pendingBreak=false}flush();return slides}
    function showKaraokeLine(){ $('karaoke-line').textContent=karaokeLines[karaokeIndex]||' ';$('karaoke-progress').textContent=`${karaokeIndex+1} / ${karaokeLines.length}`;$('karaoke-prev').disabled=karaokeIndex===0;$('karaoke-next').textContent=karaokeIndex===karaokeLines.length-1?'Fine':'Avanti →' }
    $('karaoke-song').addEventListener('change',loadLyricsForSong);
    $('edit-lyrics').addEventListener('click',()=>{loadLyricsForSong();$('lyrics-dialog').showModal()});
    $('save-lyrics').addEventListener('click',async()=>{const lyrics=$('lyrics-input').value.trim();if(!lyrics){$('lyrics-toast').textContent='Aggiungi almeno una riga di testo.';return}lyricsStore[$('karaoke-song').value]=lyrics;const savedToFile=await persistLyrics();$('lyrics-toast').textContent=savedToFile?'Testo salvato in testi.json.':'Testo salvato solo in questo browser.';setTimeout(()=>$('lyrics-toast').textContent='',2800)});
    $('start-karaoke').addEventListener('click',async()=>{const title=$('karaoke-song').value,lyrics=(lyricsStore[title]||$('lyrics-input').value).trim();if(!title){$('toast').textContent='Prima scegli un canto.';return}if(!lyrics){$('toast').textContent='Per questo canto manca il testo: aggiungilo con “Modifica testo”.';$('lyrics-dialog').showModal();return}karaokeLines=groupLyrics(lyrics);karaokeIndex=0;$('karaoke-title').textContent=title;$('karaoke-view').hidden=false;showKaraokeLine()});
    $('karaoke-prev').addEventListener('click',()=>{if(karaokeIndex>0){karaokeIndex--;showKaraokeLine()}});
    $('karaoke-next').addEventListener('click',()=>{if(karaokeIndex<karaokeLines.length-1){karaokeIndex++;showKaraokeLine()}else{$('karaoke-view').hidden=true}});
    $('karaoke-close').addEventListener('click',()=>{$('karaoke-view').hidden=true;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})});
    $('karaoke-fullscreen').addEventListener('click',()=>{if(!document.fullscreenElement){const enter=$('karaoke-view').requestFullscreen;if(enter)enter.call($('karaoke-view')).catch(()=>{})}else if(document.exitFullscreen)document.exitFullscreen().catch(()=>{})});
    document.addEventListener('keydown',event=>{if($('karaoke-view').hidden)return;if(event.key==='ArrowRight'||event.key===' '){event.preventDefault();$('karaoke-next').click()}else if(event.key==='ArrowLeft')$('karaoke-prev').click();else if(event.key==='Escape')$('karaoke-close').click()});
    function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function drawSong(){if(busy||!songs.length)return;busy=true;$('draw').disabled=true;$('song-message').textContent='Armon sta mescolando le note…';let n=0;const interval=setInterval(()=>{const pick=songs[Math.floor(Math.random()*songs.length)];$('song-result').hidden=false;$('category').hidden=true;$('song-result').textContent=pick;$('song-result').classList.remove('spin');void $('song-result').offsetWidth;$('song-result').classList.add('spin');n++;if(n>=13){clearInterval(interval);let choices=songs.filter(s=>songs.length<2||s!==lastSong);lastSong=choices[Math.floor(Math.random()*choices.length)];$('song-result').textContent=lastSong;$('karaoke-song').value=lastSong;loadLyricsForSong();$('category').textContent='🎶 Il canto scelto';$('category').hidden=false;$('song-message').textContent='Ecco il canto! Ora chiediamo ad Armon una missione.';$('again').hidden=false;$('toast').textContent='';busy=false;$('draw').disabled=false}} ,95)}
    function selectSong(song){if(busy||!songs.includes(song))return;lastSong=song;$('song-result').hidden=false;$('song-result').textContent=song;$('song-result').classList.remove('spin');$('category').textContent='🎶 Canto scelto da voi';$('category').hidden=false;$('karaoke-song').value=song;loadLyricsForSong();$('song-message').textContent='Avete scelto il canto! Ora chiediamo ad Armon una missione.';$('again').hidden=false;$('toast').textContent=''}
    $('song-list').addEventListener('click',event=>{const button=event.target.closest('[data-song-index]');if(button)selectSong(songs[Number(button.dataset.songIndex)])});
    $('avatar').innerHTML=eagleMascot;
    let flightTimer;
    function setStyle(style){
      const flying=style==='flight', animation=$('flight-animation');
      $('stage').classList.toggle('style-flight',flying);$('stage').classList.toggle('style-mascot',!flying);$('avatar').innerHTML=eagleMascot;
      $('mascot-style').setAttribute('aria-pressed',String(!flying));$('flight-style').setAttribute('aria-pressed',String(flying));$('mascot-style').classList.toggle('is-selected',!flying);$('flight-style').classList.toggle('is-selected',flying);
      clearTimeout(flightTimer);
      if(flying){$('stage').classList.add('video-playing');animation.hidden=false;animation.onload=()=>{flightTimer=setTimeout(()=>{$('stage').classList.remove('video-playing');animation.hidden=true},4400)};animation.onerror=()=>{$('stage').classList.remove('video-playing');animation.hidden=true;$('toast').textContent='Animazione non disponibile.'};animation.src='assets/ottavio-entrata-trasparente.webp?v='+Date.now()}
      else{animation.hidden=true;$('stage').classList.remove('video-playing')}
    }
    $('mascot-style').addEventListener('click',()=>setStyle('mascot'));$('flight-style').addEventListener('click',()=>setStyle('flight'));
    $('draw').addEventListener('click',drawSong);$('again').addEventListener('click',drawSong);
    $('new-challenge').addEventListener('click',()=>{$('challenge').textContent=challenges[Math.floor(Math.random()*challenges.length)];$('challenge').classList.remove('spin');void $('challenge').offsetWidth;$('challenge').classList.add('spin')});
    $('director').addEventListener('click',()=>{$('challenge').textContent='Il direttore di oggi è… '+['la persona alla tua destra','la persona alla tua sinistra','chi ha voglia di provarci','chi compie gli anni più vicino'][Math.floor(Math.random()*4)]+'!';});
    $('save-songs').addEventListener('click',()=>{const updated=$('song-input').value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!updated.length){$('toast').textContent='Aggiungi almeno un canto prima di salvare.';return}songs=updated;localStorage.setItem('missione-note-songs',JSON.stringify(songs));lastSong='';renderSongs();$('toast').textContent='Elenco aggiornato!';setTimeout(()=>$('toast').textContent='',2200)});
    $('reset-songs').addEventListener('click',()=>{songs=examples.slice();localStorage.removeItem('missione-note-songs');lastSong='';renderSongs();$('toast').textContent='Esempi ripristinati.';setTimeout(()=>$('toast').textContent='',2200)});
    $('load-file').addEventListener('click',()=>$('song-file').click());
    $('song-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;const imported=(await file.text()).split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));if(!imported.length){$('toast').textContent='Il file non contiene titoli di canti.';return}songs=imported;lastSong='';localStorage.setItem('missione-note-songs',JSON.stringify(songs));renderSongs();$('toast').textContent=`Caricati ${songs.length} canti dal file.`;setTimeout(()=>$('toast').textContent='',2800);event.target.value=''});
    renderSongs();
    fetch('testi.json?ts='+Date.now(),{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('File testi.json non trovato');return response.json()}).then(data=>{if(data&&typeof data==='object'&&!Array.isArray(data)){lyricsStore={...getLyrics(),...data};localStorage.setItem('missione-note-lyrics',JSON.stringify(lyricsStore));loadLyricsForSong()}}).catch(()=>{});
    async function readExternalSongs(){try{const response=await fetch('canti.txt?ts='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('File non trovato');const text=await response.text();const fromFile=text.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));if(!fromFile.length)throw new Error('Il file non contiene titoli');songs=fromFile;lastSong='';localStorage.setItem('missione-note-songs',JSON.stringify(songs));renderSongs();$('toast').textContent='Elenco aggiornato da canti.txt.';setTimeout(()=>$('toast').textContent='',2500)}catch{}}
    readExternalSongs();
    const noteLetters=['Do','Re','Mi','Fa','Sol','La','Si'];
    const noteLevels=[
      {title:'Note naturali · Do-Re-Mi fino al Do',clef:'treble',min:0,max:7},
      {title:'Note naturali · gravi e acute',clef:'treble',min:-2,max:11},
      {title:'Diesis e bemolli',clef:'treble',min:0,max:7,accidentals:true},
      {title:'Chiave di basso · Do-Re-Mi fino al Do',clef:'bass',min:3,max:10},
      {title:'Chiave di basso · note gravi e acute',clef:'bass',min:-2,max:11},
      {title:'Chiave di basso · diesis e bemolli',clef:'bass',min:3,max:10,accidentals:true}
    ];
    let noteLevelIndex=0,noteLevelScore=0,noteCurrent=null,noteLocked=false,noteTimer,noteGuideIndex=0;
    function noteDetails(step,clef){
      const letterIndex=clef==='bass'?(step+4)%7:((step%7)+7)%7;
      const octave=clef==='bass'?2+Math.floor((step+4)/7):4+Math.floor(step/7);
      return {letter:noteLetters[letterIndex],octave,letterIndex};
    }
    function noteAnswerName(note){return note.letter+(note.accidental==='#'?'♯':note.accidental==='b'?'♭':'')}
    function updateNoteProgress(){const level=noteLevels[noteLevelIndex];$('note-level').textContent=`Livello ${noteLevelIndex+1}/6 · ${level.title}`;$('note-score').textContent=`${noteLevelScore}/5`}
    function renderNoteQuestion(){
      clearTimeout(noteTimer);
      const level=noteLevels[noteLevelIndex],step=level.min+Math.floor(Math.random()*(level.max-level.min+1));
      const details=noteDetails(step,level.clef),accidental=level.accidentals?['#','b',null][Math.floor(Math.random()*3)]:null;
      noteCurrent={step,...details,accidental};
      const y=level.clef==='bass'?120-step*10:140-step*10,note=$('staff-note'),ledger=$('ledger-lines');
      note.setAttribute('cy',y);note.setAttribute('transform',`rotate(-20 198 ${y})`);$('staff-accidental').textContent=accidental==='#'?'♯':accidental==='b'?'♭':'';$('staff-accidental').setAttribute('y',y+7);$('staff-clef').textContent=level.clef==='bass'?'𝄢':'𝄞';
      ledger.replaceChildren();
      const ledgerSteps=level.clef==='bass'?[-4,-2,10,12]:[-4,-2,0,12,14];
      if(ledgerSteps.includes(step)){const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1','184');line.setAttribute('x2','212');line.setAttribute('y1',y);line.setAttribute('y2',y);ledger.append(line)}
      $('staff-title').textContent=`Pentagramma in chiave ${level.clef==='bass'?'di basso':'di violino'}`;$('staff-desc').textContent=`Nota sul pentagramma in chiave ${level.clef==='bass'?'di basso':'di violino'}.`;
      updateNoteProgress();$('note-feedback').textContent='';$('note-feedback').className='note-feedback';noteLocked=false;
      const correctName=noteAnswerName(noteCurrent),options=new Set([correctName]);
      while(options.size<3){const otherStep=level.min+Math.floor(Math.random()*(level.max-level.min+1)),other=noteDetails(otherStep,level.clef);other.accidental=level.accidentals?['#','b',null][Math.floor(Math.random()*3)]:null;options.add(noteAnswerName(other))}
      $('note-answers').innerHTML=[...options].sort(()=>Math.random()-.5).map(name=>`<button class="note-answer" aria-label="${escapeHtml(name.replace('♯',' diesis').replace('♭',' bemolle'))}" data-note="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('');
      $('note-answers').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>answerNote(button.dataset.note)));
    }
    function answerNote(answer){
      if(noteLocked)return;
      if(answer===noteAnswerName(noteCurrent)){
        noteLocked=true;noteLevelScore++;$('note-answers').querySelectorAll('button').forEach(button=>button.disabled=true);$('note-feedback').textContent='✓';$('note-feedback').className='note-feedback correct';updateNoteProgress();
        noteTimer=setTimeout(()=>{
          if(noteLevelScore===5){
            $('note-feedback').textContent='';$('note-feedback').className='note-feedback';$('note-celebration-status').textContent=`Livello ${noteLevelIndex+1} completato.`;
            if(noteLevelIndex===noteLevels.length-1){$('note-celebration-status').textContent='Hai completato tutti e sei i livelli.';$('note-replay').hidden=false;playNoteCelebration(true);return}
            playNoteCelebration();noteTimer=setTimeout(()=>{noteLevelIndex++;noteLevelScore=0;noteGuideIndex=0;renderNoteQuestion()},2200);return;
          }
          renderNoteQuestion();
        },850);
      }else{$('note-feedback').textContent='Riprova';$('note-feedback').className='note-feedback try-again'}
    }
    let celebrationFrame=0,celebrationCleanupTimer=0;
    function playNoteCelebration(finale=false){
      cancelAnimationFrame(celebrationFrame);clearTimeout(celebrationCleanupTimer);
      const canvas=$('note-celebration'),ctx=canvas.getContext('2d'),rect=canvas.getBoundingClientRect();if(!ctx||!rect.width||!rect.height)return;
      const card=$('note-game-card');card.classList.remove('party','finale');card.classList.add(finale?'finale':'party');$('note-guide').classList.add('celebrating');
      const dpr=Math.min(window.devicePixelRatio||1,2),width=rect.width,height=rect.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      const duration=finale?3800:2100,started=performance.now(),symbols=['♫','♪','♬','✦'],colors=['#355caa','#e58a28','#d36c8c','#f0c64d','#42a27a'];
      const particles=Array.from({length:finale?100:52},()=>({x:Math.random()*width,y:Math.random()*height*.32-height*.08,vx:(Math.random()-.5)*2.1,vy:1.5+Math.random()*3.2,size:16+Math.random()*20,spin:(Math.random()-.5)*.055,angle:Math.random()*6.28,symbol:symbols[Math.floor(Math.random()*symbols.length)],color:colors[Math.floor(Math.random()*colors.length)]}));
      const finish=()=>{ctx.clearRect(0,0,width,height);card.classList.remove('party','finale');$('note-guide').classList.remove('celebrating');celebrationFrame=0};
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){celebrationCleanupTimer=setTimeout(finish,duration);return}
      function drawFrame(now){const elapsed=now-started;ctx.clearRect(0,0,width,height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=Math.min(1,(duration-elapsed)/450+0.12);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;if(p.y>height+24){p.y=-24;p.x=Math.random()*width}ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.font=`${p.size}px serif`;ctx.fillText(p.symbol,0,0);ctx.restore()}ctx.globalAlpha=1;if(elapsed<duration)celebrationFrame=requestAnimationFrame(drawFrame);else finish()}
      celebrationFrame=requestAnimationFrame(drawFrame);celebrationCleanupTimer=setTimeout(finish,duration+120);
    }
    function getNoteGuideTips(){const level=noteLevels[noteLevelIndex];if(level.clef==='bass')return ['In chiave di basso, leggi dall’alto verso il basso: sulle linee trovi La, Fa, Re, Si, Sol.','Negli spazi, dall’alto verso il basso, trovi Sol, Mi, Do, La.','Per diesis e bemolli, guarda il simbolo subito prima della nota: ♯ alza, ♭ abbassa.'];if(level.accidentals)return ['Il diesis ♯ alza la nota di un semitono.','Il bemolle ♭ abbassa la nota di un semitono.','Guarda il simbolo prima del pallino: ti dice se è diesis o bemolle.'];if(noteLevelIndex===1)return ['Le note possono uscire dal pentagramma: anche gli spazi sopra e sotto contano.','Parti da Do e segui la scala: Do, Re, Mi, Fa, Sol, La, Si, Do.','Per le note più acute guarda in alto; per quelle più gravi guarda in basso.'];return ['Parti dal Do e sali una nota alla volta: Do, Re, Mi, Fa, Sol, La, Si, Do.','Osserva l’altezza del pallino: ogni linea e ogni spazio è una nota diversa.','Prova a cantare la scala mentre segui la nota con gli occhi!']}
    $('note-guide').addEventListener('click',()=>{const tips=getNoteGuideTips();$('note-guide-message').textContent=tips[noteGuideIndex%tips.length];$('note-guide-message').hidden=false;noteGuideIndex++});
    $('note-replay').addEventListener('click',()=>{cancelAnimationFrame(celebrationFrame);clearTimeout(celebrationCleanupTimer);$('note-celebration').getContext('2d').clearRect(0,0,$('note-celebration').width,$('note-celebration').height);$('note-game-card').classList.remove('party','finale');$('note-guide').classList.remove('celebrating');noteLevelIndex=0;noteLevelScore=0;noteGuideIndex=0;$('note-celebration-status').textContent='';$('note-replay').hidden=true;renderNoteQuestion()});
    document.addEventListener('click',event=>{if(!event.target.closest('.note-guide'))$('note-guide-message').hidden=true});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')$('note-guide-message').hidden=true});
    renderNoteQuestion();
