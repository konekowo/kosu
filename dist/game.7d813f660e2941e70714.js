!function(){"use strict";var e,t={9082:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.AudioPlayer=void 0;t.AudioPlayer=class{static playingAudios=[];static audioChangeListeners=[];static musicQueue=[];static autoPlay=!0;static play(e){if(this.playingAudios.length>0){let e;e=setInterval((()=>{let t=this.playingAudios[0].audio.volume;if(t-=.01,t<0)return t=0,clearInterval(e),this.playingAudios[0].audio.pause(),void this.playingAudios.splice(0,1);t>1&&(t=1),this.playingAudios[0].audio.volume=t}),10)}let t=URL.createObjectURL(e);return this.playingAudios.push({audio:new Audio(t),startTime:0}),new Promise((e=>{this.playingAudios[this.playingAudios.length-1].audio.play().then((()=>{e(),this.audioChangeListeners.forEach((e=>{e(this.playingAudios[this.playingAudios.length-1])})),this.playingAudios[this.playingAudios.length-1].startTime=Date.now()}))}))}static addToQueue(e){let t=URL.createObjectURL(e);this.musicQueue.push({audio:new Audio(t),startTime:0,beatmapID:0})}static playFromQueue(){}static setAutoPlay(e){this.autoPlay=e}static isAutoPlayOn(){return this.autoPlay}static onAudioChange(e){this.audioChangeListeners.push(e)}static removeOnAudioChange(e){this.audioChangeListeners=this.audioChangeListeners.filter((t=>t!==e))}static playSoundEffect(e){let t=URL.createObjectURL(e),i=new Audio(t);i.play(),i.onended=()=>{URL.revokeObjectURL(t)}}}},49323:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.LoadAnim=void 0;const o=a(i(58687)),r=i(23360);class l extends o.Container{bg;arc;arcContainer;animInterval;container;bgContainer;bgRotation=0;constructor(e,t){super(),this.pivot.set(.5,.5),this.container=new o.Container,this.container.alpha=0,this.rotation=2.5*Math.PI,this.bgContainer=new o.Container,this.bg=new o.Graphics,this.bg.roundRect(-50,-50,100,100,25),this.bg.fill(e),this.arcContainer=new o.Container,this.arc=new o.Graphics,this.arc.arc(0,0,27,Math.PI+.26,2.92*Math.PI),this.arc.stroke({width:8,color:t,cap:"round"}),this.arc.scale.set(-1,1),this.container.scale.set(.5,.5),this.bgContainer.addChild(this.bg),this.arcContainer.addChild(this.arc),this.bgContainer.addChild(this.arcContainer),this.container.addChild(this.bgContainer),this.addChild(this.container),r.ease.add(this.container,{alpha:1,scale:1},{duration:400,ease:"easeInOutQuad"}),this.doAnims(),this.animInterval=setInterval((()=>{this.doAnims()}),800)}doAnims(){this.bgRotation+=90,r.ease.add(this.bgContainer,{angle:this.bgRotation},{duration:600,ease:"easeInOutQuad"})}getWidth(){return 100*this.scale.x}getHeight(){return 100*this.scale.y}draw(e){this.arcContainer.angle+=3*e.deltaTime}destroy(e){r.ease.add(this.container,{alpha:0,scale:.5},{duration:400,ease:"easeInOutQuad"}),setTimeout((()=>{clearInterval(this.animInterval),super.destroy(e)}),400)}}t.LoadAnim=l},16982:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.Menu=void 0;const o=a(i(58687)),r=i(23360);class l extends o.Container{menuBG=new o.Graphics;isOpened=!1;openAnim;constructor(){super(),this.menuBG.rect(0,-62.5,1,125),this.menuBG.fill({color:"rgb(50,50,50)"}),this.menuBG.scale.set(1,0),this.menuBG.alpha=0,this.addChild(this.menuBG)}Open(){this.isOpened=!0,this.openAnim=r.ease.add(this.menuBG,{scaleY:1,alpha:1},{duration:400,ease:"easeOutQuint"})}Close(){this.isOpened=!1,this.openAnim&&this.openAnim.remove(),r.ease.add(this.menuBG,{scaleY:0,alpha:0},{duration:300,ease:"easeInSine"})}isOpen(){return this.isOpened}onResize(){this.position.set(-window.innerWidth,0),this.menuBG.width=2*window.innerWidth}}t.Menu=l},54349:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.OsuCircle=void 0;const o=a(i(58687)),r=i(44961),l=i(23360),h=i(20825),d=i(12235),u=i(16982),c=i(9082);class p extends o.Container{outline;triangles=new r.Triangles;beatContainer=new o.Container;hoverContainer=new o.Container;moveContainer=new o.Container;parallaxContainer=new o.Container;menu=new u.Menu;isBeingHovered=!1;constructor(){super(),this.outline=o.Sprite.from("mainMenu.logoOutline"),this.outline.anchor.set(.5,.5);let e=.6,t=o.Sprite.from("mainMenu.logoMask");t.anchor.set(.5,.5),t.scale=e;let i=o.Sprite.from("mainMenu.logoMask");i.anchor.set(.5,.5),i.scale=e,i.alpha=0,this.outline.scale.set(e),this.triangles.scale.set(e),this.triangles.position.set(-this.outline.width/2,-this.outline.height/2),this.triangles.mask=t,this.parallaxContainer.addChild(this.menu),this.beatContainer.addChild(this.triangles),this.beatContainer.addChild(t),this.beatContainer.addChild(i),this.beatContainer.addChild(this.outline),this.hoverContainer.addChild(this.beatContainer),this.moveContainer.addChild(this.hoverContainer),this.parallaxContainer.addChild(this.moveContainer),this.addChild(this.parallaxContainer),this.hoverContainer.eventMode="dynamic",this.hoverContainer.hitArea=new o.Circle(0,0,300);let n=d.Loader.Get("mainMenu.osuLogo.select"),s=d.Loader.Get("mainMenu.osuLogo.backToLogo");const a=()=>{this.isBeingHovered=!0,l.ease.add(this.hoverContainer,{scale:1.1},{duration:500,ease:"easeOutElastic"})};let r;this.hoverContainer.hitArea.contains(h.Main.mousePos.x,h.Main.mousePos.y)&&a(),this.hoverContainer.addEventListener("mouseenter",(()=>{a()})),this.hoverContainer.addEventListener("mouseleave",(()=>{this.isBeingHovered=!1,l.ease.add(this.hoverContainer,{scale:1},{duration:500,ease:"easeOutElastic"})})),this.hoverContainer.addEventListener("mousedown",(()=>{r=l.ease.add(this.hoverContainer,{scale:.9},{duration:1e3,ease:"easeOutSine"})}));const u=()=>{r&&r.remove(),l.ease.add(this.hoverContainer,{scale:this.isBeingHovered?1.1:1},{duration:500,ease:"easeOutElastic"})};let p,g,f,m;this.hoverContainer.addEventListener("mouseup",(()=>{u()})),this.hoverContainer.addEventListener("click",(()=>{this.menu.isOpen()||(this.isBeingHovered=!1),u(),this.menu.isOpen()||(f&&f.remove(),m&&m.remove()),i.alpha=.4,l.ease.add(i,{alpha:0},{duration:1500,ease:"easeOutExpo"}),this.menu.isOpen()||(c.AudioPlayer.playSoundEffect(n),p=l.ease.add(this.moveContainer,{position:{x:-250,y:0}},{duration:200,ease:"easeInSine"}).once("complete",(()=>{this.menu.Open()})),g=l.ease.add(this.moveContainer,{scale:.5},{duration:200,ease:"easeInSine"}))})),window.addEventListener("keyup",(e=>{"Escape"==e.key&&this.menu.isOpen()&&(p.remove(),g.remove(),c.AudioPlayer.playSoundEffect(s),this.menu.Close(),f=l.ease.add(this.moveContainer,{position:{x:0,y:0}},{duration:800,ease:"easeOutExpo"}),m=l.ease.add(this.moveContainer,{scale:1},{duration:800,ease:"easeOutExpo"}))}))}onResize(){this.menu.onResize()}draw(e){this.triangles.draw(e),this.menu.isOpen()?this.parallaxContainer.position.set(h.Main.mousePos.x/120,h.Main.mousePos.y/120):this.parallaxContainer.position.set(0,0)}}t.OsuCircle=p},44961:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.EaseOutSine=t.Triangles=void 0;const o=a(i(58687)),r=i(9082);class l extends o.Container{bgGradient;triangles=[];triangleGenInterval;graphics=new o.Graphics;pulseAnimation;pulseAnimationFlash;flash;constructor(){super();let e=[16737963,13390473];function t(e,t){return Math.random()*(t-e)+e}function i(){let e=1-t(0,1),i=1-t(0,1),n=Math.sqrt(-2*Math.log(e))*Math.sin(2*Math.PI*i);return Math.max(.5+.16*n,.1)}this.bgGradient=new o.FillGradient(0,0,0,1024),e.forEach(((t,i)=>{const n=i/e.length;this.bgGradient.addColorStop(n,t)}));for(let e=0;e<15;e++)this.triangles.push({x:t(0,1024),y:t(0,1024),velocity:i()});this.triangleGenInterval=setInterval((()=>{document.hasFocus()&&this.triangles.push({x:t(0,1024),y:974,velocity:i()})}),800),this.addChild(this.graphics),this.flash=o.Sprite.from("mainMenu.logoMask"),this.flash.alpha=0,this.addChild(this.flash),this.pulseAnimation=new h(375,!0,r.AudioPlayer.playingAudios[r.AudioPlayer.playingAudios.length-1].startTime),this.pulseAnimationFlash=new h(375,!0,r.AudioPlayer.playingAudios[r.AudioPlayer.playingAudios.length-1].startTime)}destroy(e){super.destroy(e)}draw(e){this.pulseAnimation.update(),this.pulseAnimationFlash.update(),this.destroyed||(this.graphics.clear(),this.graphics.rect(0,0,1024,1024),this.graphics.fill(this.bgGradient),this.flash.alpha=this.pulseAnimationFlash.getValue()/7,this.triangles.forEach(((t,i)=>{t.y-=e.deltaTime*t.velocity*4,this.graphics.moveTo(t.x,t.y),this.graphics.lineTo(t.x-250,t.y+400),this.graphics.lineTo(t.x+250,t.y+400),this.graphics.lineTo(t.x,t.y);let n=1;t.y+50<300&&(n=(t.y+50)/300),n=Math.min(Math.max(n,0),1),this.graphics.stroke({color:new o.Color("rgba(182, 52, 111, "+n.toFixed(6)+")"),width:4}),t.y+400<0&&this.triangles.splice(i,1)})))}}t.Triangles=l;class h{startTime;duration;elapsedMS=0;reverse=!1;doReverse;constructor(e,t,i){this.startTime=i||Date.now(),this.doReverse=t,this.duration=this.doReverse?e/2:e}update(){this.elapsedMS=Date.now()-this.startTime,this.elapsedMS>this.duration&&(this.reset(),this.update())}getValue(){return this.reverse?this.func(1-this.elapsedMS/this.duration):this.func(this.elapsedMS/this.duration)}reset(){this.startTime=Date.now(),this.elapsedMS=0,this.doReverse&&(this.reverse=!this.reverse)}func(e){return Math.sin(e*Math.PI/2)}}t.EaseOutSine=h},36721:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.RandomBackground=void 0;const o=a(i(58687)),r=i(12235),l=i(84283),h=i(23360),d=i(20825);class u extends l.Screen{bgContainer=new o.Container;parallaxMultiplier=40;start(){let e=(t=1,i=r.Loader.defaultBackgroundsNum,Math.round(Math.random()*(i-t)+t));var t,i;this.bgContainer.pivot.set(.5,.5),this.bgContainer.position.set(d.Main.mousePos.x/60,d.Main.mousePos.y/60),this.addChild(this.bgContainer),this.setBG(o.Sprite.from("default_bg"+e))}setBG(e){if(0==this.bgContainer.children?.length)this.bgContainer.addChild(e);else{let t=this.bgContainer.children[0];e.zIndex=-1,this.bgContainer.addChild(e),h.ease.add(t,{alpha:0},{duration:800,ease:"linear"}).once("complete",(()=>{e.zIndex=0,t.destroy()}))}e.anchor.set(.5,.5),this.onResize()}newRandomBG(){let e=(t=1,i=r.Loader.defaultBackgroundsNum,Math.round(Math.random()*(i-t)+t));var t,i;this.setBG(o.Sprite.from("default_bg"+e))}draw(e){this.bgContainer.position.set(d.Main.mousePos.x/this.parallaxMultiplier,d.Main.mousePos.y/this.parallaxMultiplier)}onClose(){return Promise.resolve(this)}onResize(){this.bgContainer.children.forEach((e=>{if(e instanceof o.Sprite){let t,i=e.texture.width,n=e.texture.height;t=window.innerWidth>window.innerHeight?window.innerWidth/i:window.innerHeight/n,n*t<window.innerHeight?t=window.innerHeight/n:window.innerWidth,e.scale.set(t+.05),e.position.set(this.getScreenWidth()/2-this.getScreenWidth()/(2*this.parallaxMultiplier),this.getScreenHeight()/2-this.getScreenHeight()/(2*this.parallaxMultiplier))}}))}}t.RandomBackground=u},12235:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.Loader=void 0;const o=a(i(58687));t.Loader=class{static loadList=[];static loadedList=[];static defaultBackgroundsNum=8;static addToLoadList(){this.loadList.push({id:"introTrianglesTrack",url:"assets/osu-assets/osu.Game.Resources/Tracks/triangles.osz"}),this.loadList.push({id:"sample_dialog_ok",url:"assets/osu-assets/osu.Game.Resources/Samples/UI/dialog-ok-select.wav"}),this.loadList.push({id:"TorusRegular",url:"assets/fonts/TorusRegular.otf",pixiBundleName:"fonts"}),this.loadList.push({id:"TorusLight",url:"assets/fonts/TorusLight.otf",pixiBundleName:"fonts"}),this.loadList.push({id:"TorusThin",url:"assets/fonts/TorusThin.otf",pixiBundleName:"fonts"}),this.loadList.push({id:"icon_ruleset_std",url:"assets/icons/ruleset-standard.png",pixiBundleName:"textures"}),this.loadList.push({id:"icon_ruleset_mania",url:"assets/icons/ruleset-mania.png",pixiBundleName:"textures"}),this.loadList.push({id:"icon_ruleset_taiko",url:"assets/icons/ruleset-taiko.png",pixiBundleName:"textures"}),this.loadList.push({id:"icon_ruleset_ctb",url:"assets/icons/ruleset-ctb.png",pixiBundleName:"textures"}),this.loadList.push({id:"intro_triangles_osuLogo_gray",url:"assets/intro/logo-gray.png",pixiBundleName:"textures"}),this.loadList.push({id:"mainMenu.logoOutline",url:"assets/osu-assets/osu.Game.Resources/Textures/Menu/logo.png",pixiBundleName:"textures"}),this.loadList.push({id:"mainMenu.logoMask",url:"assets/menu/logo-mask.png",pixiBundleName:"textures"}),this.loadList.push({id:"mainMenu.osuLogo.select",url:"assets/osu-assets/osu.Game.Resources/Samples/Menu/osu-logo-select.wav"}),this.loadList.push({id:"mainMenu.osuLogo.backToLogo",url:"assets/osu-assets/osu.Game.Resources/Samples/Menu/back-to-logo.wav"})}static Get(e){let t;if(this.loadedList.forEach((i=>{i.id==e&&(t=i.data)})),!t)throw new Error("Asset not found!");return t}static addBackgrounds(){for(let e=1;e<this.defaultBackgroundsNum+1;e++)this.loadList.push({id:"default_bg"+e,url:"assets/osu-assets/osu.Game.Resources/Textures/Menu/menu-background-"+e+".jpg",pixiBundleName:"textures"})}static Load(){return this.addToLoadList(),this.addBackgrounds(),new Promise((e=>{let t=[],i=[],n=[],s=0,a=0;this.loadList.forEach((e=>{e.pixiBundleName?i.push(e):t.push(e)})),i.forEach((e=>{let t=!1;n.forEach((i=>{i.length>0&&i[0].pixiBundleName==e.pixiBundleName&&(i.push(e),t=!0)})),t||n.push([e])}));const r=t=>{t?a++:s++,a+s>=this.loadList.length&&e()};t.forEach((e=>{fetch(e.url).then((e=>e.blob())).then((t=>{r(),this.loadedList.push({id:e.id,data:t})})).catch((t=>{r(!0),console.warn("Asset '"+e.id+"' failed to load: "+t)}))})),n.forEach((e=>{if(e.length>0){if(!e[0].pixiBundleName)throw new Error("wtf????");let t=[];e.forEach((e=>{t.push({alias:e.id,src:e.url})})),o.Assets.addBundle(e[0].pixiBundleName,t),o.Assets.loadBundle(e[0].pixiBundleName).then((()=>{e.forEach((()=>{r()}))}))}}))}))}}},25373:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.InteractScreen=void 0;const o=i(84283),r=a(i(58687)),l=i(20825),h=i(94433),d=i(23360),u=i(9082);class c extends o.Screen{text;introTrack;clickSound;clickArea=new r.Graphics;constructor(e,t){super(),this.introTrack=e,this.clickSound=t,this.text=new r.Text({text:"Click anywhere to play!",style:{fontFamily:"TorusRegular",fontSize:36,fill:"white"}})}start(){this.text.anchor.set(.5,.5),this.text.scale.set(.5,.5),this.text.alpha=0,this.text.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.addChild(this.text),this.clickArea.rect(0,0,1,1),this.clickArea.fill("rgba(0,0,0,0)"),this.clickArea.width=this.getScreenWidth(),this.clickArea.height=this.getScreenHeight(),this.clickArea.position.set(0,0),this.addChild(this.clickArea),this.clickArea.eventMode="static",this.clickArea.cursor="pointer";const e=()=>{this.clickArea.eventMode="none",u.AudioPlayer.playSoundEffect(this.clickSound),l.Main.switchScreen(new h.IntroScreen(this.introTrack))};this.clickArea.onclick=()=>{e()},this.clickArea.ontap=()=>{e()},d.ease.add(this.text,{alpha:1,scale:1},{duration:400,ease:"easeOutQuad"})}onClose(){return new Promise((e=>{d.ease.add(this.text,{alpha:0,scale:.5},{duration:200,ease:"easeInOutQuad"}),setTimeout((()=>{e(this)}),200)}))}draw(e){}onResize(){this.text.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.clickArea.width=this.getScreenWidth(),this.clickArea.height=this.getScreenHeight(),this.clickArea.position.set(0,0)}}t.InteractScreen=c},88662:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.GlitchingTriangles=void 0;const o=a(i(58687)),r=i(23360);class l extends o.Container{constructor(e){super();let t=new o.Graphics,i=n(.2,1.2);function n(e,t){return Math.random()*(t-e)+e}t.moveTo(0,0),t.lineTo(-50*i,100*i),t.lineTo(50*i,100*i),t.lineTo(0,0),Math.random()<.5?t.fill("white"):t.stroke({color:"white",width:1});let s=n(e.x1,e.x2),a=n(e.y1,e.y2);t.position.set(s,a),r.ease.add(t,{alpha:0},{duration:200,ease:"linear"}),setTimeout((()=>{this.destroy()}),200),this.addChild(t)}}t.GlitchingTriangles=l},94433:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.IntroScreen=void 0;const o=i(84283),r=i(53931),l=i(20825),h=a(i(58687)),d=i(88662),u=i(23360),c=i(58940),p=i(9082);class g extends o.Screen{introTrackUrl;doTextSpacingAnim=!1;triangles=new h.Container;ruleSetContainer=new h.Container;flash=new h.Graphics;logoContainerContainer=new h.Container;logoContainer=new h.Container;grayLogo=h.Sprite.from("intro_triangles_osuLogo_gray");flashed=!1;welcomeText=new h.Text({text:"",style:{fontFamily:"TorusThin",fontSize:42,fill:"white",letterSpacing:5}});constructor(e){super(),this.introTrackUrl=URL.createObjectURL(e)}start(){this.welcomeText.anchor.set(.5,.5),this.welcomeText.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),setTimeout((async()=>{const{entries:e}=await(0,r.unzip)(this.introTrackUrl);for(const[t,i]of Object.entries(e))"audio.mp3"==t&&i.blob().then((e=>{p.AudioPlayer.play(e).then((()=>{this.afterAudioPlay()}))})),t.endsWith(".osu")}),500)}afterAudioPlay(){let e;this.addChild(this.welcomeText),setTimeout((()=>{this.welcomeText.text="wel",this.onResize()}),200),setTimeout((()=>{this.welcomeText.text="welcome",this.onResize()}),400),setTimeout((()=>{this.welcomeText.text="welcome to",this.onResize()}),700),this.triangles.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.addChild(this.triangles),setTimeout((()=>{this.welcomeText.text="welcome to kosu!",this.doTextSpacingAnim=!0,e=setInterval((()=>{let e=new d.GlitchingTriangles({x1:-this.welcomeText.width/2-100,x2:this.welcomeText.width/2+100,y1:-this.welcomeText.height/2-150,y2:this.welcomeText.height/2+100});this.triangles.addChild(e)}),30),this.onResize()}),900);let t=h.Sprite.from("icon_ruleset_std"),i=h.Sprite.from("icon_ruleset_taiko"),n=h.Sprite.from("icon_ruleset_ctb"),s=h.Sprite.from("icon_ruleset_mania");setTimeout((()=>{this.doTextSpacingAnim=!1,this.onResize(),clearInterval(e),this.welcomeText.destroy(),this.triangles.destroy(),this.ruleSetContainer.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.addChild(this.ruleSetContainer),t.anchor.set(.5,.5),t.scale.set(.4),this.ruleSetContainer.addChild(t),i.anchor.set(.5,.5),i.scale.set(.4),this.ruleSetContainer.addChild(i),n.anchor.set(.5,.5),n.scale.set(.4),this.ruleSetContainer.addChild(n),s.anchor.set(.5,.5),s.scale.set(.4),this.ruleSetContainer.addChild(s);t.position.set(-375,0),i.position.set(-125,0),n.position.set(125,0),s.position.set(375,0),u.ease.add(this.ruleSetContainer,{scale:.8},{duration:1e3,ease:"linear"})}),1450),setTimeout((()=>{t.position.set(-240,0),i.position.set(-75,0),n.position.set(75,0),s.position.set(240,0),t.scale.set(1),i.scale.set(1),n.scale.set(1),s.scale.set(1)}),1650),setTimeout((()=>{t.position.set(-350,0),i.position.set(-120,0),n.position.set(120,0),s.position.set(350,0),t.scale.set(2),i.scale.set(2),n.scale.set(2),s.scale.set(2),u.ease.add(this.ruleSetContainer,{scale:1.3},{duration:1e3,ease:"linear"})}),1850),setTimeout((()=>{this.ruleSetContainer.visible=!1,this.grayLogo.anchor.set(.5,.5),this.logoContainer.addChild(this.grayLogo),this.logoContainer.scale.set(1.2),this.logoContainerContainer.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.logoContainerContainer.pivot.set(.5,.5),this.logoContainerContainer.addChild(this.logoContainer),this.addChild(this.logoContainerContainer),this.logoContainerContainer.scale.set(1.2),u.ease.add(this.logoContainerContainer,{scale:1},{duration:920,ease:"easeInQuad"}),setTimeout((()=>{u.ease.add(this.logoContainer,{scale:1.2-.8},{duration:276,ease:"easeInQuint"})}),644)}),2080),setTimeout((()=>{this.flash.rect(0,0,1,1),this.flash.fill("white"),this.flash.position.set(0,0),this.flash.width=this.getScreenWidth(),this.flash.height=this.getScreenHeight(),this.addChild(this.flash),this.flashed=!0,this.logoContainerContainer.visible=!1,u.ease.add(this.flash,{alpha:0},{duration:1e3,ease:"easeOutQuad"}),l.Main.switchScreen(new c.MainMenu)}),3e3)}draw(e){this.doTextSpacingAnim&&(this.welcomeText.style.letterSpacing+=.15*e.deltaTime,this.onResize())}onClose(){return new Promise((e=>{setTimeout((()=>{e(this)}),1e3)}))}onResize(){this.welcomeText.destroyed||this.welcomeText.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.triangles.destroyed||this.triangles.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.ruleSetContainer.destroyed||this.ruleSetContainer.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),!this.flash.destroyed&&this.flashed&&(this.flash.position.set(0,0),this.flash.width=this.getScreenWidth(),this.flash.height=this.getScreenHeight()),this.logoContainerContainer.destroyed||this.logoContainerContainer.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2)}}t.IntroScreen=g},76969:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.LoadScreen=void 0;const n=i(84283),s=i(49323),a=i(58293);class o extends n.Screen{loadAnim;start(){this.loadAnim=new s.LoadAnim("rgba(255,255,255,0.7)","black");let e=a.Settings.getRangeSetting("UI scaling").getValue();this.loadAnim.scale.set(.8*e,.8*e),this.loadAnim.position.set(this.getScreenWidth()-this.loadAnim.getWidth()-15,this.getScreenHeight()-this.loadAnim.getHeight()-15),this.addChild(this.loadAnim)}draw(e){this.loadAnim?.draw(e)}onClose(){return new Promise((e=>{null!=this.loadAnim&&this.loadAnim.destroy(),setTimeout((()=>{e(this)}),400)}))}onResize(){null!=this.loadAnim?.position&&this.loadAnim.position.set(this.getScreenWidth()-this.loadAnim.getWidth()-20,this.getScreenHeight()-this.loadAnim.getHeight()-20)}}t.LoadScreen=o},58940:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.MainMenu=void 0;const n=i(84283),s=i(36721),a=i(54349);class o extends n.Screen{bg=new s.RandomBackground;osuCircle=new a.OsuCircle;start(){this.bg.start(),this.addChild(this.bg),this.addChild(this.osuCircle)}draw(e){this.bg.draw(e),this.osuCircle.draw(e)}onClose(){return new Promise((e=>{this.bg.onClose().then((()=>{e(this)}))}))}onResize(){this.osuCircle.position.set(this.getScreenWidth()/2,this.getScreenHeight()/2),this.bg.onResize(),this.osuCircle.onResize()}}t.MainMenu=o},84283:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;const o=a(i(58687));class r extends o.Container{constructor(){super()}getScreenWidth(){return window.innerWidth}getScreenHeight(){return window.innerHeight}}t.Screen=r},75341:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.SettingsCategory=t.Setting=void 0;const n=i(58293);var s;t.Setting=class{constructor(e){n.Settings.register({setting:this,data:e})}},function(e){e.General="General",e.Skin="Skin",e.Input="Input",e.UserInterface="User Interface",e.Gameplay="Gameplay",e.Rulesets="Rulesets",e.Audio="Audio",e.Graphics="Graphics",e.Online="Online",e.Maintenance="Maintenance",e.Debug="Debug"}(s||(t.SettingsCategory=s={}))},74975:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.DropdownSetting=void 0;const n=i(75341);class s extends n.Setting{value;getValue(){if(!this.value)throw new Error("Value is undefined!");return this.value}setValue(e){this.value=e}}t.DropdownSetting=s},78642:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.RangeSetting=void 0;const n=i(75341);class s extends n.Setting{value=0;getValue(){return this.value}setValue(e){this.value=e}}t.RangeSetting=s},58293:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Settings=void 0;const n=i(64681),s=i(78642),a=i(44256),o=i(74975);t.Settings=class{static settingsList=[];constructor(){new a.Renderer,new n.UIScale}static register(e){this.settingsList.push(e)}static getRangeSetting(e){let t=!1;if(this.settingsList.forEach((i=>{if(i.data.name==e&&i.setting instanceof s.RangeSetting)return t=!0,i.setting})),!t)throw new Error("Invalid Setting Name!");return new n.UIScale}static getDropDownSetting(e){let t=!1;if(this.settingsList.forEach((i=>{if(i.data.name==e&&i.setting instanceof o.DropdownSetting)return t=!0,i.setting})),!t)throw new Error("Invalid Setting Name!");return new a.Renderer}static getList(){return this.settingsList}}},44256:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Renderer=void 0;const n=i(75341),s=i(74975);class a extends s.DropdownSetting{list=[];webglOption={displayName:"WebGL",value:"webgl"};webGpuOption={displayName:"WebGPU",value:"webgpu"};defaultValue=this.webglOption;constructor(){super({name:"Renderer",category:n.SettingsCategory.Graphics}),this.value=this.defaultValue}}t.Renderer=a},64681:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.UIScale=void 0;const n=i(78642),s=i(75341);class a extends n.RangeSetting{maxValue=.8;minValue=1.6;increment=.1;defaultValue=1;constructor(){super({name:"UI scaling",category:s.SettingsCategory.Graphics}),this.value=this.defaultValue}}t.UIScale=a},29820:function(e,t,i){i(11307);const n=i(58687),s=i(20825),a=i(58293),o=window.innerWidth,r=window.innerHeight,l=new n.Application;window.onload=async()=>{new a.Settings;let e=a.Settings.getDropDownSetting("Renderer").getValue().value;l.init({backgroundColor:"black",width:o,height:r,antialias:!0,preference:e,resolution:window.devicePixelRatio,autoDensity:!0}).then((()=>{new s.Main(l)}))}},20825:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0}),t.Main=void 0;const n=i(76969),s=i(25373),a=i(12235);class o{static app;static currentScreen;static allScreens=[];static mousePos={x:0,y:0};constructor(e){o.app=e,document.body.appendChild(o.app.canvas),this.doResize(),window.addEventListener("resize",this.doResize),o.app.stage.eventMode="static",o.app.stage.addEventListener("mousemove",(e=>{o.mousePos.x=e.clientX,o.mousePos.y=e.clientY})),o.switchScreen(new n.LoadScreen),navigator.mediaSession.setActionHandler("play",(function(){})),navigator.mediaSession.setActionHandler("pause",(function(){})),navigator.mediaSession.setActionHandler("stop",(function(){})),navigator.mediaSession.setActionHandler("seekbackward",(function(){})),navigator.mediaSession.setActionHandler("seekforward",(function(){})),navigator.mediaSession.setActionHandler("previoustrack",(function(){})),navigator.mediaSession.setActionHandler("nexttrack",(function(){})),a.Loader.Load().then((()=>{let e=a.Loader.Get("sample_dialog_ok"),t=a.Loader.Get("introTrianglesTrack");o.switchScreen(new s.InteractScreen(t,e))}))}doResize(){o.app.renderer.resize(window.innerWidth,window.innerHeight),o.app.stage.scale.x=1,o.app.stage.scale.y=1,o.allScreens.forEach((e=>{e.onResize()}))}static switchScreen(e){null!=this.currentScreen&&(this.currentScreen.zIndex=1,this.currentScreen.onClose().then((e=>{for(let t=0;t<this.allScreens.length;t++)this.allScreens[t]==e&&this.allScreens.splice(t,1);o.app.ticker.remove(e.draw),o.app.stage.removeChild(e),e.destroy()}))),o.app.stage.addChild(e),this.allScreens.push(e),this.currentScreen=e,e.start(),e.onResize(),o.app.ticker.add(e.draw,e)}}t.Main=o},11307:function(e,t,i){i.r(t)}},i={};function n(e){var s=i[e];if(void 0!==s)return s.exports;var a=i[e]={id:e,loaded:!1,exports:{}};return t[e].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=t,e=[],n.O=function(t,i,s,a){if(!i){var o=1/0;for(d=0;d<e.length;d++){i=e[d][0],s=e[d][1],a=e[d][2];for(var r=!0,l=0;l<i.length;l++)(!1&a||o>=a)&&Object.keys(n.O).every((function(e){return n.O[e](i[l])}))?i.splice(l--,1):(r=!1,a<o&&(o=a));if(r){e.splice(d--,1);var h=s();void 0!==h&&(t=h)}}return t}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[i,s,a]},n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.hmd=function(e){return(e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e={179:0};n.O.j=function(t){return 0===e[t]};var t=function(t,i){var s,a,o=i[0],r=i[1],l=i[2],h=0;if(o.some((function(t){return 0!==e[t]}))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(l)var d=l(n)}for(t&&t(i);h<o.length;h++)a=o[h],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(d)},i=self.webpackChunkpixi_typescript_boilerplate=self.webpackChunkpixi_typescript_boilerplate||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var s=n.O(void 0,[507],(function(){return n(29820)}));s=n.O(s)}();