import AudioList from "./lib/AudioList";
export default AudioList;

// const audioList = AudioList.create()

// audioList.setPlayerList(
// [
//     {
//         src:'https://m10.music.126.net/20240402170733/0a2a188e5e96367554f5b3542fd894c9/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/14053250220/dd87/4ae2/cea1/b0527953b0247670e94cb8f4d3c3a0dc.mp3',
//         title:'怪天气',
//         serial:1,
//     },{
//         src:'https://m10.music.126.net/20240402170907/526c68d19673973d7b4e4b501d093989/ymusic/020f/0f5a/0452/5ec0e7fc2480a8f9b4ee383a32086bc6.mp3',
//         title:'天气',
//         serial:2,
//     },{
//         src:'https://m801.music.126.net/20240402173645/ab1326e9fbc261dfcff5a1561840ad22/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/34133390504/16d8/1ed7/0e29/af6a1ab4ced82857e97b65980b8c37cf.mp3',
//         title:'3',
//         serial:3,
//     }
// ])

// audioList.addEventListener('play',()=>{
//     console.log("play")
// })

// document.querySelector('#play_btn')?.addEventListener('click',()=>{
//     console.log("e-->")
//     audioList.play()
// })

// document.querySelector('#range')?.addEventListener('input',(e)=>{
//     console.log(e.target.value)
//     document.querySelector("#progress").innerText = e.target.value
//     audioList.progress = e.target.value
// })

// audioList.addEventListener('videoListTimeupdate',(e)=>{
//     document.querySelector('#range').value = e.detail.progress
//     document.querySelector("#progress").innerText = e.detail.progress
//     document.querySelector('#currentTime_format').innerText = e.detail.formatCurrentTime
//     document.querySelector('#duration_format').innerText = e.detail.formatDuration
// })

// document.querySelector('#play_mode_select')?.addEventListener('change',(e)=>{
//    audioList.mode = e.target.value
// })
