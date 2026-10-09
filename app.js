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
    const eagleMascot = `<img src="assets/aquila-ottavio.png" alt="Ottavio, aquila supereroe della musica" draggable="false">`;
    const $ = id => document.getElementById(id);
    let songs = loadSongs(), lastSong = "", busy = false;
    function loadSongs(){try{const saved=JSON.parse(localStorage.getItem("missione-note-songs"));return Array.isArray(saved)&&saved.length?saved:examples.slice()}catch{return examples.slice()}}
    function renderSongs(){ $('song-list').innerHTML=songs.map((song,i)=>`<div class="song"><span class="num">${i+1}</span><span>${escapeHtml(song)}</span></div>`).join('');$('song-input').value=songs.join('\n');const select=$('karaoke-song'),previous=select.value;select.innerHTML=songs.map(song=>`<option value="${escapeHtml(song)}">${escapeHtml(song)}</option>`).join('');if(songs.includes(previous))select.value=previous;loadLyricsForSong() }
    function getLyrics(){try{return JSON.parse(localStorage.getItem('missione-note-lyrics')||'{}')}catch{return {}}}
    let lyricsStore=getLyrics();
    function loadLyricsForSong(){$('lyrics-input').value=lyricsStore[$('karaoke-song').value]||''}
    async function persistLyrics(){localStorage.setItem('missione-note-lyrics',JSON.stringify(lyricsStore));try{const response=await fetch('/api/lyrics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lyricsStore)});return response.ok}catch{return false}}
    let karaokeLines=[],karaokeIndex=0;
    function groupLyrics(text){const slides=[];let group=[],phrases=0,size=0,pendingBreak=false;const flush=()=>{if(phrases){slides.push(group.join('\n'));group=[];phrases=0;size=0;pendingBreak=false}};for(const raw of text.split(/\r?\n/)){const line=raw.trim();if(!line){if(phrases)pendingBreak=true;continue}const nextSize=size+line.length+1;if(phrases>=5&&(phrases>=6||nextSize>300))flush();if(pendingBreak&&phrases)group.push('');group.push(line);phrases++;size+=line.length+1;pendingBreak=false}flush();return slides}
    function showKaraokeLine(){ $('karaoke-line').textContent=karaokeLines[karaokeIndex]||' ';$('karaoke-progress').textContent=`${karaokeIndex+1} / ${karaokeLines.length}`;$('karaoke-prev').disabled=karaokeIndex===0;$('karaoke-next').textContent=karaokeIndex===karaokeLines.length-1?'Fine':'Avanti →' }
    $('karaoke-song').addEventListener('change',loadLyricsForSong);
    $('save-lyrics').addEventListener('click',async()=>{const lyrics=$('lyrics-input').value.trim();if(!lyrics){$('toast').textContent='Aggiungi almeno una riga di testo.';return}lyricsStore[$('karaoke-song').value]=lyrics;const savedToFile=await persistLyrics();$('toast').textContent=savedToFile?'Testo salvato in testi.json.':'Testo salvato solo in questo browser.';setTimeout(()=>$('toast').textContent='',2800)});
    $('start-karaoke').addEventListener('click',async()=>{const title=$('karaoke-song').value,lyrics=$('lyrics-input').value.trim();if(!title||!lyrics){$('toast').textContent='Scegli un canto e aggiungi il suo testo.';return}lyricsStore[title]=lyrics;await persistLyrics();karaokeLines=groupLyrics(lyrics);karaokeIndex=0;$('karaoke-title').textContent=title;$('karaoke-view').hidden=false;showKaraokeLine()});
    $('karaoke-prev').addEventListener('click',()=>{if(karaokeIndex>0){karaokeIndex--;showKaraokeLine()}});
    $('karaoke-next').addEventListener('click',()=>{if(karaokeIndex<karaokeLines.length-1){karaokeIndex++;showKaraokeLine()}else{$('karaoke-view').hidden=true}});
    $('karaoke-close').addEventListener('click',()=>{$('karaoke-view').hidden=true;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})});
    $('karaoke-fullscreen').addEventListener('click',()=>{if(!document.fullscreenElement){const enter=$('karaoke-view').requestFullscreen;if(enter)enter.call($('karaoke-view')).catch(()=>{})}else if(document.exitFullscreen)document.exitFullscreen().catch(()=>{})});
    document.addEventListener('keydown',event=>{if($('karaoke-view').hidden)return;if(event.key==='ArrowRight'||event.key===' '){event.preventDefault();$('karaoke-next').click()}else if(event.key==='ArrowLeft')$('karaoke-prev').click();else if(event.key==='Escape')$('karaoke-close').click()});
    function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function drawSong(){if(busy||!songs.length)return;busy=true;$('draw').disabled=true;$('toast').textContent='Armon sta mescolando le note…';let n=0;const interval=setInterval(()=>{const pick=songs[Math.floor(Math.random()*songs.length)];$('song-result').hidden=false;$('category').hidden=true;$('song-result').textContent=pick;$('song-result').classList.remove('spin');void $('song-result').offsetWidth;$('song-result').classList.add('spin');n++;if(n>=13){clearInterval(interval);let choices=songs.filter(s=>songs.length<2||s!==lastSong);lastSong=choices[Math.floor(Math.random()*choices.length)];$('song-result').textContent=lastSong;$('karaoke-song').value=lastSong;loadLyricsForSong();$('category').textContent='🎶 Il canto scelto';$('category').hidden=false;$('message').textContent='È uscito questo canto! Siete pronti a cantare insieme?';$('again').hidden=false;$('toast').textContent='';busy=false;$('draw').disabled=false}} ,95)}
    $('avatar').innerHTML=eagleMascot;
    let flightTimer;
    function setStyle(style){
      const flying=style==='flight', animation=$('flight-animation');
      $('stage').classList.toggle('style-flight',flying);$('stage').classList.toggle('style-mascot',!flying);$('avatar').innerHTML=eagleMascot;
      $('mascot-style').setAttribute('aria-pressed',String(!flying));$('flight-style').setAttribute('aria-pressed',String(flying));
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
