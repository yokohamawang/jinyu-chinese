(function(){
'use strict';
var buttonSelector=[
  '#kidsTwoSpellingP16.kp205 .kp192-picker button',
  '#kidsTwoSpellingP16.kp205 .kp205-controls button',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-list button',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-controls button',
  '#kidsWholeSyllableLesson.kp205 .kp192-picker button',
  '#kidsWholeSyllableLesson.kp205 .kp205-controls button'
].join(',');
var activeSelector=[
  '#kidsTwoSpellingP16.kp205 .kp192-picker button:active:not(:disabled)',
  '#kidsTwoSpellingP16.kp205 .kp205-controls button:active:not(:disabled)',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-list button:active:not(:disabled)',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-controls button:active:not(:disabled)',
  '#kidsWholeSyllableLesson.kp205 .kp192-picker button:active:not(:disabled)',
  '#kidsWholeSyllableLesson.kp205 .kp205-controls button:active:not(:disabled)'
].join(',');
var pressedSelector=[
  '#kidsTwoSpellingP16.kp205 .kp192-picker button.kp-ui-pressed:not(:disabled)',
  '#kidsTwoSpellingP16.kp205 .kp205-controls button.kp-ui-pressed:not(:disabled)',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-list button.kp-ui-pressed:not(:disabled)',
  '#kidsThreeSpellingLesson.kp223-three-spelling .kp223-controls button.kp-ui-pressed:not(:disabled)',
  '#kidsWholeSyllableLesson.kp205 .kp192-picker button.kp-ui-pressed:not(:disabled)',
  '#kidsWholeSyllableLesson.kp205 .kp205-controls button.kp-ui-pressed:not(:disabled)'
].join(',');
var style=document.createElement('style');
style.id='kp259-course-switch-press-style';
style.textContent=buttonSelector+'{touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform 90ms cubic-bezier(.2,.75,.25,1),box-shadow 90ms ease,filter 90ms ease}'+
activeSelector+','+pressedSelector+'{transform:translateY(3px) scale(.98)!important;filter:brightness(.96) saturate(.94);box-shadow:inset 0 2px 4px rgba(35,76,55,.22),0 1px 0 rgba(90,125,99,.22)!important}'+
'@media(prefers-reduced-motion:reduce){'+buttonSelector+'{transition:none!important}}';
(document.head||document.documentElement).appendChild(style);
var pressed=null;
function clear(){if(pressed){pressed.classList.remove('kp-ui-pressed');pressed=null}}
function press(event){var target=event.target;if(!target||!target.closest)return;var button=target.closest(buttonSelector);if(!button||button.disabled)return;clear();pressed=button;pressed.classList.add('kp-ui-pressed')}
function release(){clear()}
document.addEventListener('pointerdown',press,true);
document.addEventListener('pointerup',release,true);
document.addEventListener('pointercancel',release,true);
document.addEventListener('touchstart',press,{capture:true,passive:true});
document.addEventListener('touchend',release,{capture:true,passive:true});
document.addEventListener('touchcancel',release,{capture:true,passive:true});
document.addEventListener('click',release,true);
window.addEventListener('blur',release);
document.addEventListener('visibilitychange',release);
})();
