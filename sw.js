/* Ersatz für den Service Worker der alten App.
   Geräte, auf denen die alte App noch installiert ist, holen sich diese
   Datei beim nächsten Start. Sie löscht den alten Zwischenspeicher, meldet
   sich selbst ab und lädt die Seite neu – danach sehen alle die Umzugsseite. */
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(ev){
  ev.waitUntil(
    caches.keys()
      .then(function(k){ return Promise.all(k.map(function(n){ return caches.delete(n); })); })
      .then(function(){ return self.registration.unregister(); })
      .then(function(){ return self.clients.matchAll({type:"window"}); })
      .then(function(fenster){ fenster.forEach(function(f){ f.navigate(f.url); }); })
  );
});
