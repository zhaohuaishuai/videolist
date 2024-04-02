

export enum PLAYMODEENUM {
     /**
     * 循环播放
     */
    LOOP = 'loop',
    /**
     * 单曲循环
     */
    SINGLE ='single',
    /**
     * 顺序播放
     */
    ORDER = 'order',
    /**
     *  随机播放
     */
    RANDOM = 'random'
}

export type PLAYMODETYPE = 'loop' | 'single' | 'order' | 'random'


/**
 * 播放器列表
 */
export interface IplayerList {
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

export interface CreateAudioMethodsParams {
    playerList:IplayerList[]
}


function getRandomInt(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 格式化秒数为 HH:mm:ss
 * @param duration 
 * @returns 
 */
function formatDuration(duration:number) {
    const hours = Math.floor(duration / 3600); // 计算小时数
    const minutes = Math.floor((duration - (hours * 3600)) / 60); // 计算分钟数
    const seconds = Math.floor(duration - (hours * 3600) - (minutes * 60)); // 计算秒数

    // 用两位数表示小时、分钟和秒，不足两位时前面补0
    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

class AudioList extends Audio {
    /**
     * 播放模式
     */
    public mode:PLAYMODETYPE = PLAYMODEENUM.LOOP
    /**
     * 当前播放的索引
     */
    public _currentIndex:number = 0
    set currentIndex(index:number){
        this.src = this.playerList[index].src
        console.log("currentIndex",index)
        console.log("this.paused",this.paused)
        // if(this.paused){
        //    this.pause()
        // } else {
        //     this.play()
        // }
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
    prev(isPlay?:boolean){
        const nextIndex = this.currentIndex - 1
        if(nextIndex<0){
            const len = this.playerList.length
            this.currentIndex = len - 1
            return
        }
        this.currentIndex = nextIndex
        if(isPlay){
            this.play()
        }
    }
    /**
     * 下一首
     */
    next(isPlay?:boolean){
        const len = this.playerList.length
        const nextIndex = this.currentIndex + 1
        if(nextIndex === len){
            this.currentIndex = 0
            return
        }
        this.currentIndex = nextIndex
        if(isPlay){
            this.play()
        }
    }
    randomPlay(isPlay?:boolean){
        const len = this.playerList.length
        const nextIndex = getRandomInt(0,len-1)
        this.currentIndex = nextIndex
        if(isPlay){
            this.play()
        }
    }
    init(){
        this.addEventListener('ended',this.onEnded.bind(this))
        this.ontimeupdate = this.onCustomTimeupdate
    }
    /**
     * 播放完成事件
     * @param event 
     */
    private onEnded(event:Event){
        console.log("ened",event)
        switch(this.mode){
            case PLAYMODEENUM.LOOP:
                this.next(true)
                break
            case PLAYMODEENUM.SINGLE:
                this.play()
                break
            case PLAYMODEENUM.ORDER:
                if((this.playerList.length -1) === this.currentIndex)return
                this.next(true)
                break
            case PLAYMODEENUM.RANDOM:
                this.randomPlay(true)
                break
        }
    }
    private onCustomTimeupdate(e:Event){
        const event = new CustomEvent('videoListTimeupdate',{detail:{
            ...e,
            progress:this.progress, 
            type:'videoListTimeupdate',
            formatDuration:formatDuration(this.duration || 0),
            formatCurrentTime:formatDuration(this.currentTime || 0),
        }})
        this.dispatchEvent(event)
    }
    set progress(pro:number){
        const durcation = this.duration
        if(durcation){
            this.currentTime =  (pro/100 )* durcation
        }
    }
    /**
     * 播放进度百分比
     */


    get progress(){
        return this.duration? Math.floor((this.currentTime / this.duration) * 100):0
    }
}

export default AudioList