"use strict";const currentCache="cache-b4996b1e6f",urlsToCache=["/manifest.json","/","/style.css","/script.js","/images/logo.svg","/images/logo_192.png","/images/logo_512.png"];self.addEventListener("install",e=>{e.waitUntil(caches.open(currentCache).then(e=>e.addAll(urlsToCache)).catch(e=>{console.error("SW failed to install: could not load cache cache-b4996b1e6f: "+e)}))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(-1===currentCache.indexOf(e))return caches.delete(e)}))).catch(e=>{console.error("SW failed to activate: could not remove legacy cache: "+e)}))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)).catch(e=>{console.error("SW failed to fetch resource: "+e)}))});