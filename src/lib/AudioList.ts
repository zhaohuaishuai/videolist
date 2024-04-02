


const PlayMode = {
    LOOP: 'loop',     // 循环播放
    SINGLE: 'single', // 单曲循环
    ORDER: 'order',   // 顺序播放
    RANDOM: 'random', // 随机播放
  }

//   PAUSE: 'pause',   // 暂停
//   STOP: 'stop',     // 停止
//   PLAYING: 'playing', // 正在播放
//   MUTE: 'mute'      // 静音



/**
 * 播放器列表
 */
interface IplayerList {
    /**
     * 播放链接
     */
    src:string,
    /**
     * 曲目名称
     */
    title:string,
    /**
     * 序号
     */
    serial:number,
    /**
     * 其它扩展字段
     */
    [propsName:string]:any
}

interface CreateAudioMethodsParams {
    playerList:IplayerList[]
}
class AudioList extends Audio {
    /**
     * 当前播放的索引
     */
    public _currentIndex:number = 0
    set currentIndex(index:number){
        this.src = this.playerList[index].src
        if(this.paused){
           this.pause()
        } else {
            this.play()
        }
        this._currentIndex = index
    }
    get currentIndex(){
        return this._currentIndex
    }
    /**
     * 播放器列表
     */
    public playerList: CreateAudioMethodsParams['playerList'] = []
    private constructor() {
        super();
    }
    static audioList: AudioList
    /**
     * 创建播放器
     * @returns 
     */
    public static create(){
        if(!this.audioList){
            const audio = new AudioList()
            this.audioList = audio 
            audio.init()
           
        }
        return this.audioList
    }
    /**
     * 设置播放列表
     * @param playerList 
     * @param index 设置要播放的索引 默认是 0
     */
    setPlayerList(playerList: CreateAudioMethodsParams['playerList'], index:number = 0){
        this.playerList = playerList
        this.currentIndex = index
        this.src = playerList[index].src
        const event = new CustomEvent('setPlayerList',{detail:playerList})
        this.dispatchEvent(event)
    }
    /**
     * 获取当前播放列表
     * @returns 
     */
    getPlayerList(){
        return this.playerList
    }
    /**
     * 上一首播放
     */
    prev(){
        const nextIndex = this.currentIndex - 1
        if(nextIndex<0){
            const len = this.playerList.length
            this.currentIndex = len - 1
            return
        }
        this.currentIndex = nextIndex
    }
    /**
     * 下一首
     */
    next(){
        const len = this.playerList.length
        const nextIndex = this.currentIndex + 1
        if(nextIndex === len){
            this.currentIndex = 0
            return
        }
        this.currentIndex = nextIndex
    }

    init(){
        this.addEventListener('ended',this.onEnded.bind(this))

    }
    /**
     * 播放完成事件
     * @param event 
     */
    private onEnded(event:Event){
        console.log("ened",event)
    }
    

}

export default AudioList