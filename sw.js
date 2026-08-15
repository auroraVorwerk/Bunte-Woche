/* Digitaler Businessplan – Offlinebetrieb
   Die App selbst wird zwischengespeichert, die Daten holt Firebase.
   Bei der Versionsnummer eine Zahl hochzählen, wenn eine neue index.html
   ODER eine neue ui.css hochgeladen wird. */
const VERSION = "bw-v32";
const DATEIEN = ["./", "./index.html", "./ui.css", "./manifest.json"];

self.addEventListener("install", ev=>{
  self.skipWaiting();
  ev.waitUntil(caches.open(VERSION).then(c=>c.addAll(DATEIEN)).catch(()=>{}));
});
self.addEventListener("activate", ev=>{
  ev.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", ev=>{
  const url = new URL(ev.request.url);
  if(ev.request.method !== "GET") return;
  /* Firebase und Schriften nie aus dem Zwischenspeicher bedienen */
  if(url.hostname.includes("firebase") || url.hostname.includes("google") ||
     url.hostname.includes("gstatic") || url.hostname.includes("komoot")) return;
  ev.respondWith(
    fetch(ev.request).then(r=>{
      const kopie = r.clone();
      caches.open(VERSION).then(c=>c.put(ev.request, kopie)).catch(()=>{});
      return r;
    }).catch(()=> caches.match(ev.request).then(t=> t || caches.match("./index.html")))
  );
});
