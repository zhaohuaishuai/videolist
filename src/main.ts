import AudioList from './lib/AudioList'
const audioList = AudioList.create()

audioList.setPlayerList(
[
    {
        src:'https://zhimei20240104.tos-cn-beijing.volces.com/1711676056898__&&__%E6%9D%8E0309-03%E5%B9%B4%E8%BD%BB1.mp4',
        title:'1',
        serial:1,
    },{
        src:'https://zhimei20240104.tos-cn-beijing.volces.com/1711596681402__&&__abc.mp4',
        title:'2',
        serial:2,
    },{
        src:'https://zhimei20240104.tos-cn-beijing.volces.com/1711535451902__&&__1711517809307__&&__%E6%9C%B4%E6%AD%A3%E7%84%95%E7%89%87%E5%A4%B440.mp4',
        title:'3',
        serial:3,
    }
])

audioList.addEventListener('play',()=>{
    console.log("play")
})

document.querySelector('#play_btn')?.addEventListener('click',()=>{
    console.log("e-->")
    audioList.play()
})





